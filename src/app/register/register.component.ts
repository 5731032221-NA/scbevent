import { Component, OnInit , Pipe, PipeTransform } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, RequiredValidator, PatternValidator} from "@angular/forms";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { ScbService } from '../scb.service';
import { async } from '@angular/core/testing';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

@Pipe({
  name: 'shortUrl'
})
export class RegisterComponent implements OnInit    {

  
  flag = false;
  data: any[] = [];
  urldata = [];
  cloudName = 'dfwsao3ad';
  image_id;
  res;
  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({
      cloudName: this.cloudName,
      uploadPreset: 'jqsnjnvi'
    })
  );

  loading: any;
  fileData: File = null;
  previewUrl:any[] = [];
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  empid = new FormControl('',[Validators.required])
  fname = new FormControl('',[Validators.required])
  lname = new FormControl('',[Validators.required])
  public path = [];
  //public loading = false;
  public personFaces = [];
  public personGroups = [];
  public personList = [];
  public selectedGroupId = '';
  public PID = '';
  public selectedPerson: any;
  myform: FormGroup;
  constructor(private http: HttpClient , private faceApi: ScbService, private toastr: ToasterService,private af: AngularFireDatabase) {
    
    this.getImages();
   }
   
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    
  console.log(this.empid.value)
    this.myform = new FormGroup({
     
      empid: this.empid,
      fname: this.fname,
      lname: this.lname
    });
  }
   

  async upload() {
    this.loading = true;

    this.uploader.uploadAll(); // call for uploading the data to Cloudinary
    /* Getting the success response from Cloudinary. */
     this.uploader.onSuccessItem =  (item: any, response: string, status: number, headers: any): any => {
      this.res = JSON.parse(response);
      this.loading = false;
      this.image_id = this.res.public_id;
      console.log("AA" + this.res);
      this.af.list('/cloudinaryupload').push(this.res) // Storing the complete response from Cloudinary
    }

    /* Getting the Error message Cloudinary throws. */
    this.uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers)
    };
  }

  /* Listing all the images and their information from the cloudinaryupload collection in firebase */
  getImages() {
    const ref = this.af.database.ref('/cloudinaryupload');

    /* Fat arrow functions which exist in ES6 it is the same as function(snapshot) {} */
    ref.on('value', (snapshot) => {
      this.data = this.snapshotToArray(snapshot);
    });
  }

  /* 
  * Responsible for converting Firebase snapshot to an array.
  */
  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };
  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.urldata.push(this.fileData)
      this.preview();
      
  }
 
  async preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var n =this.urldata.length;
    if(n > 3){
      alert("คุณได้ใส่จำนวนรูปครบแล้ว")
      return;
    }
    var reader = await new FileReader();    
    var url;
  // for(var i = 0 ; i < 3 ; i++){
    reader.readAsDataURL(this.urldata[n-1]); 
    reader.onload = async (_event) => { 
    url = await reader.result; 
    this.previewUrl.push(url)
  // }
    


      console.log(this.previewUrl)
    
      this.addPerson();
      
    }
   
  }

    

  
  addPerson() {
    if(this.previewUrl.length < 2){
      let newPerson: any = { name: this.empid.value };
      this.faceApi.createPerson('062bf552-c0f1-4251-89c4-8c7bbf8b5da1', { name: this.fname.value }).subscribe(data => {
        newPerson.personId = data.personId;
     
        this.PID = data.personId;
        console.log("11:" + this.PID)
        this.personList.push(newPerson);
        this.selectedPerson = newPerson;
      });
      
    }


      this.onSubmit();
  }

    async addPersonFace(url) {
      console.log(this.PID)
      this.faceApi.addPersonFace('062bf552-c0f1-4251-89c4-8c7bbf8b5da1', this.PID, url).subscribe(data => {
        let newFace = { persistedFaceId: data.persistedFaceId, userData: url };
       
        this.personFaces.push(newFace);
      });
     await  this.trainPersonGroup();
  }

  async trainPersonGroup() {
    this.loading = true;
    await this.faceApi.trainPersonGroup('062bf552-c0f1-4251-89c4-8c7bbf8b5da1').subscribe(data => {
     console.log( 'Training has been initiated...   ' + data);
      this.loading = false;
    });
  }

  getGroupTrainingStatus() {
    // this.loading = true;
   var re1=new RegExp('s.....')
   var re2=new RegExp('[^A-Za-z0-9_]')
   
    
   if(!this.myform.valid){
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return;
    }
    else if(!re1.exec(this.empid.value)){
      alert("รูบแบบรหัสพนักงานไม่ถูกต้อง")
      return;
    }
    else if(!re2.exec(this.fname.value)){
      alert("กรุณาใส่ชื่อภาษาไทย")
      return;
    }
    else if(!re2.exec(this.lname.value)){
      alert("กรุณาใส่นามสกุลภาษาไทย")
      return;
    }
   
    console.log(this.empid.value + ' ' + this.fname.value + ' ' + this.lname.value)
   

    this.flag = true;
    this.faceApi.getPersonGroupTrainingStatus('062bf552-c0f1-4251-89c4-8c7bbf8b5da1').subscribe(result => {
      switch (result.status) {
        case 'succeeded':
          console.log('Training Succeeded');
          
          console.log("22:" + this.PID)
          this.faceApi.InsertDB(this.empid.value,this.fname.value,this.lname.value,this.PID).subscribe(data => {
            console.log(data);
           });
          break;
        case 'running':
          console.log('Training still in progress...');
          break;
        case 'failed':
          console.log('error', 'Error during Training : ' + result.message);
          break;
        default:
          break;
      }
      this.loading = false;
    });
  }
   
  async onSubmit() {
    
    this.path = [];
    this.loading = true;
    
    this.uploader.uploadAll(); // call for uploading the data to Cloudinary

    /* Getting the success response from Cloudinary. */
     this.uploader.onSuccessItem = ( item: any, response: string, status: number, headers: any): any  => {
       this.res = JSON.parse(response);
      this.loading = false;
      this.image_id = this.res.public_id;
      console.log(this.res);
       this.af.list('/cloudinaryupload').push(this.res); // Storing the complete response from Cloudinary
       this.path.push(this.res);
       var n =this.path.length;
       
       //alert(JSON.stringify(this.path))
       this.addPersonFace(this.path[n-1].url);
     }

    /* Getting the Error message Cloudinary throws. */
     this.uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers)
     };


}
}




  

