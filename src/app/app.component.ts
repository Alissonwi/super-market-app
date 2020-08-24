import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
 
import { FormService } from './services/form.service';
import { HttpService } from './services/http.service';
import { UploadFileService } from './services/upload-file.service';

import { SuperMarket } from './interfaces/super-market';
import { SuperMarketAddress } from './interfaces/super-market-address';
import { NgxSpinnerService } from "ngx-spinner"; 
import { environment } from './../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Super Market App';
  marketsList: SuperMarket[] = [];
  marketForm: FormGroup;
  superMarketAddress: SuperMarketAddress;
  selectedSuperMarketId: string = null;
  mainImageUrl: string = "";
  additionalImageUrls = new Array<string>();
  hideMarketForm = true;
  hideButton = false;
  hideMarketList = false;
  alertMessage = '';
  isShowMessage = false;
  hideThumb = false;
  mainImageFile = File;
  additionalImageFiles = [];
 
  constructor(
    private formService: FormService,
    private httpService: HttpService,
    private SpinnerService: NgxSpinnerService,
    private uploadService: UploadFileService
  ) {
    this.marketForm = this.formService.createSuperMarketForm();
  }
 
  ngOnInit() {
    this.SpinnerService.show();
    this.getSuperMarkets();
  }

  getSuperMarkets() {
    this.marketsList = [];
    this.httpService.getSuperMarket()
    .subscribe(
      (data) => {
        if (data) {
          this.marketsList = data;
        } else {
          this.marketsList = [];
        }
      },
        (error) => {
        console.warn(error);
        this.marketsList = [];
        alert(`Unable to find super market.`);
      }
    );
    this.hideThumb = false;
    this.SpinnerService.hide();
  }
 
  async submit() {
    if(this.marketForm.valid){
      this.SpinnerService.show();
      if (this.selectedSuperMarketId !== null) {
        this.updateSuperMarket(this.selectedSuperMarketId);
      } else {
        this.addNewSuperMarket();
      }
      this.hideForm();
      this.resetForm();
    } else {
      alert('Please check all the required fields has values.')
    }
  }
 
  async addNewSuperMarket() {
    let superMarket = await this.uploadFiles(this.marketForm.value);

    this.httpService.addSuperMarket(superMarket)
    .subscribe((data) => {
      if (data) {
        this.marketsList.push(data);
        this.showMessage('Super market added with success.');
      } else {
        alert(`Error trying to add new super market`);
      }
      },
        (error) => {
        console.warn(error);
        alert(`Unable to add new super market`);
      }
    );
    this.getSuperMarkets();
    this.SpinnerService.hide();
  }

  resetForm(){
    this.selectedSuperMarketId =  null;
    this.marketForm.reset();
    this.mainImageUrl = "";
    this.additionalImageUrls = new Array<string>();
    this.additionalImageFiles = new Array<string>();
    this.mainImageFile;
    this.reloadInfos();
  }

  deleteSuperMarket(superMarketId: string) {
    this.SpinnerService.show();
    this.httpService.deleteSuperMarket(superMarketId)
    .subscribe();
    const userIndex = this.marketsList.findIndex((superMarket => superMarket._id === superMarketId));
    this.marketsList.splice(userIndex, 1);
    this.SpinnerService.hide();
    this.showMessage('Super market deleted with success.');
  }

  async editSuperMarket(superMarket: SuperMarket) {
    this.SpinnerService.show();
    this.showForm();
    this.selectedSuperMarketId = superMarket._id;
    this.marketForm.controls['superMarketName'].setValue(superMarket.superMarketName);
    if (superMarket.superMarketMainImage){
      this.mainImageUrl = superMarket.superMarketMainImage;
    }
    if (superMarket.superMarketAdditionalImages){
      this.additionalImageUrls = superMarket.superMarketAdditionalImages;
    }
    this.marketForm.controls['superMarketAddress'].setValue({
      city: superMarket.superMarketAddress.city,
      country: superMarket.superMarketAddress.country,
      district: superMarket.superMarketAddress.district,
      number: superMarket.superMarketAddress.number,
      state: superMarket.superMarketAddress.state,
      street: superMarket.superMarketAddress.street,
      zip: superMarket.superMarketAddress.zip,
    });
    this.marketForm.controls['superMarketDescription'].setValue(superMarket.superMarketDescription);
    this.marketForm.controls['superMarketPhone'].setValue(superMarket.superMarketPhone);
    this.marketUrlsToImage(this.mainImageUrl, this.additionalImageUrls);
    this.SpinnerService.hide();
  }

  async updateSuperMarket(selectedSuperMarketId) {
    let superMarket = this.marketForm.value;
    superMarket = await this.updateFiles(superMarket, this.additionalImageFiles);
    this.httpService.updateSuperMarket(selectedSuperMarketId, superMarket)
    .subscribe(
      (response) => {
      if (response) {
        const marketIndex = this.marketsList.findIndex((superMarket => superMarket._id === this.selectedSuperMarketId));
        this.marketsList[marketIndex] = response;
        this.showMessage('Super market updated with success.');
      } else {
        alert(`Erro trying to update super market`);
      }
    },
      (error) => {
      console.warn(error);
      alert(`Unable to update the super market`);
      }
    );
    this.getSuperMarkets();
    this.SpinnerService.hide();
  }

  detectMainImageFile(event) {
    let files = event.target.files;
    if (files) {
      let file: File = files[0];
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.mainImageUrl = e.target.result;
        this.mainImageFile = files[0];
      }
      reader.readAsDataURL(file);
    }
  }

  detectAdditionalImageFile(event) {
    let files = event.target.files;
    if (files) {
      for (let index = 0; index < files.length; index++) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.additionalImageUrls.push(e.target.result);
          this.additionalImageFiles.push(files[index]);
          console.log(this.additionalImageFiles);
        }
        reader.readAsDataURL(files[index]);
      }
    }
  }

  async updateFiles(superMarket, additionalImageFiles){
    let existMainImage; 
    await this.uploadService.checkFileExist(this.mainImageFile.name).then(data => existMainImage = data);
    console.log(existMainImage);
    if(!existMainImage){
      let mainFileName = this.getFileName(this.mainImageFile.name);
      await this.uploadService.uploadFile(this.mainImageFile, mainFileName);
      superMarket.superMarketMainImage = `https://${environment.bucketName}.s3.amazonaws.com/${mainFileName}`;
    } else {
      superMarket.superMarketMainImage = `https://${environment.bucketName}.s3.amazonaws.com/${this.mainImageFile.name}`;
    }

    if(additionalImageFiles.length !== 0){
      let additionalImages = [];
      for(let image of additionalImageFiles){
        let existAdditionalImage;
        await this.uploadService.checkFileExist(image.name).then(data => existAdditionalImage = data);
        console.log(image.name);
        if(!existAdditionalImage){
          let imageName = this.getFileName(image.name);
          await this.uploadService.uploadFile(image, imageName);
          console.log(imageName);
          additionalImages.push(`https://${environment.bucketName}.s3.amazonaws.com/${imageName}`);
        } else {
          console.log(image.name);
          additionalImages.push(`https://${environment.bucketName}.s3.amazonaws.com/${image.name}`);
        }
      }
      console.log(additionalImages);
      superMarket.superMarketAdditionalImages = additionalImages;
    }
    console.log(superMarket);
    return superMarket;
  }

  uploadFiles(superMarket){
    let additionalImages = [];
    let mainFileName = this.getFileName(this.mainImageFile.name);
    this.uploadService.uploadFile(this.mainImageFile, mainFileName);
    superMarket.superMarketMainImage = `https://${environment.bucketName}.s3.amazonaws.com/${mainFileName}`;
    for( let image of this.additionalImageFiles){
      let imageName = this.getFileName(image.name);
      this.uploadService.uploadFile(image, imageName);
      additionalImages.push(`https://${environment.bucketName}.s3.amazonaws.com/${imageName}`);
    }
    superMarket.superMarketAdditionalImages = additionalImages;
    return superMarket;
  }

  deleteImage(url){
    this.additionalImageUrls.splice(this.additionalImageUrls.indexOf(url), 1);
    let imageToDelete = this.urlToImage(url);
    this.additionalImageFiles.splice(this.additionalImageFiles.indexOf(imageToDelete), 1);
  }

  hideForm(){
    this.hideMarketForm = true;
    this.hideButton = false;
    this.hideMarketList = false;
  }

  showForm(){
    this.hideMarketForm = false;
    this.hideButton = true;
    this.hideMarketList = true;
  }

  backToForm(){
    this.SpinnerService.show();
    this.resetForm();
    this.hideForm();
    this.getSuperMarkets();
  }

  showMessage(message) {
    this.alertMessage = message;
    this.isShowMessage = true;
    setTimeout(() => {
      this.isShowMessage = false
      this.alertMessage = '';
    }, 3000)
  }

  hideThumbs(){
    if (this.hideThumb){
      this.hideThumb = false;
    } else {
      this.hideThumb = true; 
    }
  }

  getFileName(fileName){
    let timestamp = new Date().getTime();
    return timestamp + fileName;
  }

  marketUrlsToImage(mainImageUrl, additionalImagesUrl){
    if (mainImageUrl){
      this.mainImageFile = this.urlToImage(mainImageUrl);
    }
    if (additionalImagesUrl !== 0){
      for(let urlImage of additionalImagesUrl){
        this.additionalImageFiles.push(this.urlToImage(urlImage));
      }
    }
  }

  urlToImage(url){
    if (url){
      let splitedUrl = url.split('/');
      let fileName = splitedUrl[splitedUrl.length -1];
      let blob = fetch(url).then(r => r.blob());
      return this.blobToFile(blob, fileName);
    }
  }

  blobToFile(theBlob, fileName){
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  reloadInfos(){
    setTimeout(() => this.getSuperMarkets(), 3000);
  }
}
