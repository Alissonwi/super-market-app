import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable()
export class FormService {

  constructor() { }

  createSuperMarketForm(){ return new FormGroup({ 
      'superMarketName': new FormControl('', Validators.required),
      'superMarketMainImage': new FormControl(),
      'superMarketAdditionalImages': new FormControl(),
      'superMarketAddress': new FormGroup({
        'street': new FormControl('', Validators.required),
        'number': new FormControl('', Validators.required),
        'district': new FormControl('', Validators.required),
        'zip': new FormControl('', [Validators.pattern(/^[0-9]{5}[0-9]{3}$/), Validators.required]),
        'country': new FormControl('', Validators.required),
        'city': new FormControl('', Validators.required),
        'state': new FormControl('', Validators.required)
      }),
      'superMarketDescription': new FormControl('', Validators.required),
      'superMarketPhone': new FormControl('', [Validators.pattern(/^[1-9]{2}[0-9]{4,5}[0-9]{4}$/), Validators.required]),
    });
  }
}
