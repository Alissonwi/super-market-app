import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from './../../environments/environment';

export class UploadFileService{

    fileExist;

    constructor(){
        new AWS.Config({
            accessKeyId: `${environment.accessKeyId}`,
            secretAccessKey: `${environment.secretAccessKey}`,
            region: `${environment.region}`
        });
    }

    async uploadFile(file, fileName) {
        let contentType = file.type;
        let bucket = new S3({
            accessKeyId: `${environment.accessKeyId}`,
            secretAccessKey: `${environment.secretAccessKey}`,
            region: `${environment.region}`
        });
        let params = {
            Bucket: `${environment.bucketName}`,
            Key: fileName,
            Body: file,
            ContentType: contentType
        };
        bucket.upload(params, function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
            console.log('Successfully uploaded file.', data);
            return true;
        });
    }

    async checkFileExist(fileName) {
        const s3 = new S3().config.update({
            credentials: AWS.config.credentials
        });
        let bucket = new S3({
            accessKeyId: `${environment.accessKeyId}`,
            secretAccessKey: `${environment.secretAccessKey}`,
            region: `${environment.region}`
        });
        let params = {
            Bucket: `${environment.bucketName}`,
            Key: fileName,
        };
        return new Promise((resolve, reject) => {
            bucket.headObject(params, (err, body) => {
                if (!body) {
                    console.log(body);
                    resolve(false);
                } else {
                    console.log(body);
                    resolve(true);
                }
            });
        });
    }
}