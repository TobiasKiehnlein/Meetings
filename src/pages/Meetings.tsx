import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Meeting from '../Interfaces/Meeting';
import MeetingCard from '../components/MeetingCard';
import './Meetings.scss';
import { checkmark, pencil } from 'ionicons/icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Meetings: React.FC = () => {
	
	const [ meetings, setMeetings ] = useState<Meeting[]>([]);
	const [ edit, setEdit ] = useState(false);
	
	useEffect(() => {
		firebase.auth().onAuthStateChanged(async usr => {
			if (usr != null) {
				const path = `users/${ await firebase.auth().currentUser?.uid }/meetings`;
				console.log(path);
				firebase
					.firestore()
					.collection(path)
					.onSnapshot(snapshot =>
						setMeetings(snapshot
							.docs
							.map(doc => ({ id: doc.id, ...doc.data() }))
							.sort((a, b) => {
								const A = a as Meeting, B = b as Meeting;
								if (a == null || A.time == null) {
									debugger
									return 1;
								}
								if (b == null || B.time == null) {
									debugger
									return -1;
								}
								const currentDay = new Date().getDay();
								if (Math.abs((A.time as firebase.firestore.Timestamp).toDate().getDay() - currentDay) > Math.abs((B.time as firebase.firestore.Timestamp).toDate().getDay() - currentDay)) {
									return 1;
								}
								return -1;
							}) as Meeting[])
					);
				
			}
		});
		
	}, []);
	
	// const loadData = () => {
	// 	Storage.get({ key: MEETINGS }).then(currentMeetings => {
	// 		const currentMeetingsString: string | null = currentMeetings.value;
	// 		let meetings: Meeting[] = [];
	// 		if (currentMeetingsString) {
	// 			meetings = [ ...JSON.parse(currentMeetingsString) ];
	// 		}
	// 		setMeetings(meetings);
	// 	});
	// };
	
	const renderToolbar = (size?: 'small' | 'large') => (
		<IonToolbar>
			<IonTitle size={ size }>Meetings</IonTitle>
			<IonButtons slot="end">
				{ !size && <IonButton onClick={ () => setEdit(!edit) }>
                    <IonIcon slot="icon-only" icon={ edit ? checkmark : pencil }
                             color="dark"/>
                </IonButton> }
			</IonButtons>
		</IonToolbar>
	);
	
	return (
		<IonPage>
			<IonHeader>
				{ renderToolbar() }
			</IonHeader>
			<IonContent>
				<IonHeader collapse="condense">
					{ renderToolbar('large') }
				</IonHeader>
				<div id="meetings">
					{ meetings.map(meeting => <MeetingCard meeting={ meeting } key={ meeting.id ?? meeting.name } edit={ edit }/>) }
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Meetings;
