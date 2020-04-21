import React, {useEffect, useState} from 'react';
import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import {Plugins} from "@capacitor/core";
import {MEETINGS} from "../CONSTANTS";
import Meeting from "../Interfaces/Meeting";

const {Storage} = Plugins;

const Settings: React.FC = () => {
    const [meetings, setMeetings] = useState<string | null>(null);
    const [toast, setToast] = useState("");
    const [json, setJson] = useState("");
    const [importAlert, setImportAlert] = useState(false);

    useEffect(() => {
        Storage.get({key: MEETINGS}).then(currentMeetings => {
            const currentMeetingsString: string | null = currentMeetings.value;
            setMeetings(currentMeetingsString);
        })
    }, []);

    const exportJson = async () => {
        if (meetings) {
            const el = document.createElement('textarea');
            el.value = meetings;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setToast("Meetings copied successfully!");
        } else setToast("Please add some meetings first!");
    }

    const getMeetingsSafely = () => {
        try {
            const meetings: Meeting[] = JSON.parse(json);
            meetings.forEach(meeting => {
                if (!meeting.name || !meeting.url) throw new Error("");
            });
            return meetings;
        } catch (e) {
            setToast("Please enter valid JSON with valid content!")
        }
        return [];
    }

    const mergeJSON = async () => {
        const importMeetings: Meeting[] = getMeetingsSafely();
        if (importMeetings.length === 0) return;
        if (!meetings) await overrideJSON();
        const newMeetingNames = importMeetings.map(x => x.name);
        const oldMeetings = JSON.parse(meetings!).filter((x: Meeting) => !newMeetingNames.includes(x.name));
        await Storage.set({key: MEETINGS, value: JSON.stringify([...importMeetings, ...oldMeetings])})
        debugger;
        setToast("Imported successfully");
    }

    const overrideJSON = async () => {
        const meetings: Meeting[] = getMeetingsSafely();
        if (meetings.length === 0) return;
        await Storage.set({key: MEETINGS, value: JSON.stringify(meetings)})
        setToast("Imported successfully");
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonButton className="ion-margin" onClick={exportJson}>Export JSON</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Import Json</IonLabel>
                    <IonInput value={json} onIonChange={e => setJson(e.detail.value || "")} type="url"/>
                </IonItem>
                <IonItem>
                    <IonButton expand="block" className="ion-margin"
                               onClick={() => json !== "" ? setImportAlert(true) : setToast("Please add JSON into the input field!")}>Import
                        JSON</IonButton>
                </IonItem>
                <IonAlert
                    isOpen={importAlert}
                    onDidDismiss={() => setImportAlert(false)}
                    header={'Import?'}
                    message={'You can merge or override current meetings with import.<br/> <strong>Careful:</strong> Even with merge meetings that already exist will be deleted!'}
                    buttons={[
                        {
                            text: 'Override',
                            handler: overrideJSON
                        },
                        {
                            text: 'Merge',
                            handler: mergeJSON
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        }
                    ]}
                />
                <IonToast isOpen={!!toast && toast !== ""} message={toast} duration={2000}
                          onDidDismiss={() => setToast("")}/>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
