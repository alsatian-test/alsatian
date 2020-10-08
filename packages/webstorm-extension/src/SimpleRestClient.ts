import * as https from "http";

export class SimpleRestClient {

    public post(url: string, postData: string): Promise<void> {
        if (postData == null)
            postData = "";
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/text',
                'Content-Length': postData.length
            }
        }
        return new Promise((resolve, reject) => {
            let clientRequest = https.request(url, options, (response) => {
                let todo = '';

                // called when a data chunk is received.
                response.on('data', (chunk) => {
                    todo += chunk;
                });

                // called when the complete response is received.
                response.on('end', () => {
                    if (response.statusCode != 200) {
                        reject(new Error("IDE reported an error processing the message"));
                    } else {
                        resolve();
                    }
                });

            }).on("error", (error: Error) => {
                console.log("Error: " + error.message);
                reject(error);
            });
            clientRequest.write(postData);
            clientRequest.end();
        });
    }
}
