import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-generator-start',
  templateUrl: './generator-start.component.html',
  styleUrls: ['./generator-start.component.css']
})
export class GeneratorStartComponent implements OnInit {
  profileForm = this.fb.group({
  });
  status='Idle'; 
  
  constructor(private fb: FormBuilder, private generatorService: GeneratorService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.status='Generator about to launch';
    console.log('Generator about to launch');
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.valid);
    //
    var answer=this.generatorService.generate(null);
    answer.subscribe((res) => {console.log('OK:',res); this.status='OK:'+res;},
      (err) => {console.log('Error:',err); this.status='Error:'+err;},
      () => {console.log('Done!'); this.status='Done';});
    //
    this.status='Generator launched';
    console.log('Generator Launched');
  }
}
