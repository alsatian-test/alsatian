import * as https from "http";
import { IncomingMessage } from "http";

export class SimpleRestClient {

	public post(url: string, postData: string): Promise<void> {
		if (postData == null)
			postData = "";
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/text",
				"Content-Length": postData.length
			}
		};
		return this.createPromise(url, options, postData);
	}

	private createPromise(url: string, options: { headers: { "Content-Length": number; "Content-Type": string }; method: string }, postData: string): Promise<void> {
		return new Promise((resolve, reject) => {
			let clientRequest = https.request(url, options, (response) => {
				this.processResponse(response, reject, resolve);

			}).on("error", (error: Error) => {
				console.log("Error: " + error.message);
				reject(error);
			});
			clientRequest.write(postData);
			clientRequest.end();
		});
	}

	private processResponse(response: IncomingMessage, reject: (reason?: any) => void, resolve: (value?: (PromiseLike<void> | void)) => void) {
		let data = "";

		// called when a data chunk is received.
		response.on("data", (chunk) => {
			data += chunk;
		});

		// called when the complete response is received.
		response.on("end", () => {
			if (response.statusCode != 200) {
				reject(new Error("IDE reported an error processing the message"));
			} else {
				resolve();
			}
		});
	}
}
