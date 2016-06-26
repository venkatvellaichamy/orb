import { Ant } from "../lib/ant";
import firebase from "firebase";

export class FirebaseAnt extends Ant {
	constructor (web, params) {
		super (web, params);
		
		firebase.initializeApp(params.firebase);
		this.db = firebase.database();
		this.dbValue = {};
	}
}