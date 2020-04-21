import React, {useEffect, useState} from 'react';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {Plugins} from '@capacitor/core';
import Meeting from "../Interfaces/Meeting";
import {MEETINGS} from "../CONSTANTS";
import MeetingCard from "../components/MeetingCard";
import "./Meetings.scss";
import {checkmark, pencil} from "ionicons/icons";

const {Storage} = Plugins;

const Meetings: React.FC = () => {

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        loadData();
        setInterval(loadData, 10000);
    }, []);

    const loadData = () => {
        Storage.get({key: MEETINGS}).then(currentMeetings => {
            const currentMeetingsString: string | null = currentMeetings.value;
            let meetings: Meeting[] = [];
            if (currentMeetingsString) meetings = [...JSON.parse(currentMeetingsString)];
            setMeetings(meetings);
        })
    };

    const renderToolbar = (size?: "small" | "large") => (
        <IonToolbar>
            <IonTitle size={size}>Meetings</IonTitle>
            <IonButtons slot="end">
                {!size && <IonButton onClick={() => setEdit(!edit)}>
                    <IonIcon slot="icon-only" icon={edit ? checkmark : pencil}
                             color="dark"/>
                </IonButton>}
            </IonButtons>
        </IonToolbar>
    )

    return (
        <IonPage>
            <IonHeader>
                {renderToolbar()}
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    {renderToolbar("large")}
                </IonHeader>
                <div id="meetings">
                    {meetings.map(meeting => <MeetingCard name={meeting.name} url={meeting.url} key={meeting.name}
                                                          edit={edit} updateMeetings={setMeetings}/>)}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Meetings;
