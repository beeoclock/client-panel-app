// sendNotification.ts (Node.js)

const serverKey = '-BDFCkZUqqHb8-_xW2cir6yJbgXBT0JVSVMPnU8an_c';
const deviceToken = 'eS261OUfVbCEd7mNoUQ8u3:APA91bFSa_bPgKG1aZWkO0BkmNHQnMR1Y5FsaHyXRsJ7y4P84ZW-piAWKYnt3JXWiroXc-lDptynyM6aNJTLuy2-l5jthhrx9Nf-_FuhNR1mCt98uBPSlE8';

const payload = {
	to: deviceToken,
	notification: {
		title: 'New message!',
		body: 'You’ve got a new update!',
	},
};

console.log("Sending notification...", payload);

async function sendNotification() {
	const result = await fetch('https://fcm.googleapis.com/fcm/send', {
		method: 'POST',
		headers: {
			'Authorization': `key=${serverKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	console.log({result})

	if (result.ok) {
		const data = await result.json();
		console.log('Notification sent successfully:', data);
	}
}

sendNotification()
	.then(() => {
		console.log('Notification sent successfully 2');
	})
	.catch((error) => {
		console.error('Error sending notification:', error);
	});
