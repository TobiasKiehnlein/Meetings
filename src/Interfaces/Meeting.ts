import firebase from 'firebase';

export default interface Meeting {
	id?: string;
	name: string;
	url: string;
	time?: firebase.firestore.Timestamp
}
