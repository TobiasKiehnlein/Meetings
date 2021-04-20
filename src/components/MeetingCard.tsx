import React, { useEffect, useState } from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/react';
import { logoGoogle, removeCircle, videocam } from 'ionicons/icons';

import './MeetingCard.scss';
import Meeting from '../Interfaces/Meeting';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

interface Props {
	meeting: Meeting,
	edit: boolean
}


interface HeaderProp {
	key: string,
	value: string,
	icon?: string
}

const headerProperties: HeaderProp[] = [
	{ key: 'zoom.us', value: 'Zoom', icon: videocam },
	{ key: 'google.', value: 'Google', icon: logoGoogle },
	{ key: 'meet.jit.si', value: 'Jitsi' }
];

const MeetingCard: React.FC<Props> = ({ edit, meeting }) => {
	const [ subtitle, setSubtitle ] = useState('');
	const [ icon, setIcon ] = useState<string | undefined>();
	
	useEffect(() => {
		headerProperties.forEach(prop => {
			if (meeting.url.includes(prop.key)) {
				setSubtitle(prop.value);
				setIcon(prop.icon);
			}
		});
	}, [ meeting.url ]);
	
	const deleteMeeting = async (event: any) => {
		event.preventDefault();
		const path = `users/${ await firebase.auth().currentUser?.uid }/meetings`;
		firebase.firestore().collection(path).doc(meeting.id).delete();
		// const currentMeetingsString: string | null = (await Storage.get({key: MEETINGS})).value;
		// let currentMeetings: Meeting[] = [];
		// if (currentMeetingsString) currentMeetings = JSON.parse(currentMeetingsString);
		// const filteredMeetings = currentMeetings.filter(x => x.name !== name);
		// await Storage.set({key: MEETINGS, value: JSON.stringify(filteredMeetings)});
		// updateMeetings(filteredMeetings);
	};
	return (
		<IonCard href={ edit ? '#' : meeting.url } target="_blank">
			<div id="icons">
				{ icon && <IonIcon icon={ icon } className="large"/> }
				{ edit && <IonButtons className="delete"><IonIcon slot="icon-only" icon={ removeCircle } className="large"
                                                                  onClick={ deleteMeeting }/></IonButtons> }
			</div>
			<IonCardHeader className={ icon ? 'icon' : 'no-icon' }>
				<IonCardSubtitle>{ subtitle }</IonCardSubtitle>
				<IonCardTitle>{ meeting.name }</IonCardTitle>
			</IonCardHeader>
			<IonCardContent>{ meeting.url }<br/>{ (meeting.time as any)?.toDate && (meeting.time as firebase.firestore.Timestamp)?.toDate().toLocaleTimeString(undefined, {weekday: "short", minute: "numeric", hour: "numeric"}) }</IonCardContent>
		</IonCard>
	);
};

export default MeetingCard;
