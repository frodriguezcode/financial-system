import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyBajFpXblx1bQIp0jemfYfJ-3dYN2g4Wlo",
    authDomain: "sistemafinanciero-924ff.firebaseapp.com",
    projectId: "sistemafinanciero-924ff",
    storageBucket: "sistemafinanciero-924ff.appspot.com",
    messagingSenderId: "433637403268",
    appId: "1:433637403268:web:8d6d607debfeb92b8070d1"
  };

  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireAuthModule,
      AngularFireDatabaseModule,
    ],
    exports: [
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireAuthModule,
      AngularFireDatabaseModule
    ]
  })
  export class FirebaseModule { }
  