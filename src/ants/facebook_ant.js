import { Ant } from "../lib/ant";
import restler from "restler";

export class FaceBookAnt extends Ant {
	constructor (web, params) {
		super (web, params);

		this._initialize();
	}

	_initialize () {
		restler.post(this.params.facebook.uris.subscribe + '?access_token=' + this.params.facebook.access_token)
			.on("error", data => {  
				(result instanceof Error) && console.log('Error:', result.message); 
			});
	}

	sendTextMessage (recipient, text) {
		restler.post(this.params.facebook.uris.messages + '?access_token=' + this.params.facebook.access_token, {
			data: {
				recipient: { id: recipient },
				message: { text }
			}
		}).on("error", data => {  
			(result instanceof Error) && console.log('Error:', result.message.substring(0,100)); 
		});
	}

	sendAttachment (recipient, attachment) {
		restler.post(this.params.facebook.uris.messages + '?access_token=' + this.params.facebook.access_token, {
			data: {
				recipient: { id: recipient },
				message: { attachment }
			}
		}).on("error", data => {  
			(result instanceof Error) && console.log('Error:', result.message); 
		});
	}
}