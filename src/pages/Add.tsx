import React, { useState } from 'react';
import { IonButton, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import './Add.scss';
import { MEETINGS } from '../CONSTANTS';
import Meeting from '../Interfaces/Meeting';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const { Storage } = Plugins;

const Add: React.FC = () => {
	const [ name, setName ] = useState('');
	const [ url, setUrl ] = useState('');
	const [ toast, setToast ] = useState('');
	const [ selectedDate, setSelectedDate ] = useState('');
	
	const save = async () => {
		if (name === '' || url === '') {
			setToast('Please fill in name and url!');
			return;
		}
		const currentMeeting: Meeting = { name, url, time: selectedDate === '' ? undefined : firebase.firestore.Timestamp.fromDate(new Date(selectedDate)) };
		
		const currentMeetingsString: string | null = (await Storage.get({ key: MEETINGS })).value;
		let currentMeetings: Meeting[] = [];
		
		if (currentMeetingsString) {
			currentMeetings = JSON.parse(currentMeetingsString);
		}
		
		if (currentMeetings.find(x => x.name === currentMeeting.name)) {
			setToast('You already added a meeting with that name!');
			return;
		}
		
		currentMeetings = [ currentMeeting, ...currentMeetings ];
		await Storage.set({ key: MEETINGS, value: JSON.stringify(currentMeetings) });
		const path = `users/${ await firebase.auth().currentUser?.uid }/meetings`;
		await firebase.firestore().collection(path).add(currentMeeting); // TODO handle error
		
		setName('');
		setUrl('');
		setSelectedDate('');
		setToast('The meeting ' + name + ' was saved successfully!');
	};
	
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Add</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Add</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonItem>
					<IonLabel position="floating">Name</IonLabel>
					<IonInput value={ name } onIonChange={ e => setName(e.detail.value || '') }/>
				</IonItem>
				<IonItem>
					<IonLabel position="floating">URL</IonLabel>
					<IonInput value={ url } onIonChange={ e => setUrl(e.detail.value || '') } type="url"/>
				</IonItem>
				<IonItem>
					<IonLabel position="floating">Zeit</IonLabel>
					<IonDatetime displayFormat="D MMM YYYY H:mm" value={ selectedDate } onIonChange={ e => setSelectedDate(e.detail.value!) }/>
				</IonItem>
				<IonButton expand="block" className="ion-margin"
				           onClick={ save }>Save</IonButton>
				<IonToast isOpen={ !!toast && toast !== '' } message={ toast } duration={ 2000 }
				          onDidDismiss={ () => setToast('') }/>
			</IonContent>
		</IonPage>
	);
};

export default Add;
