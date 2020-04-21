import React, {useEffect, useState} from "react";
import {IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon} from "@ionic/react";
import {logoGoogle, removeCircle, videocam} from "ionicons/icons";
import {Plugins} from "@capacitor/core";

import './MeetingCard.scss';
import Meeting from "../Interfaces/Meeting";
import {MEETINGS} from "../CONSTANTS";

const {Storage} = Plugins;

interface Props {
    name: string,
    url: string,
    edit: boolean,
    updateMeetings: (meetings: Meeting[]) => any
}


interface HeaderProp {
    key: string,
    value: string,
    icon?: string
}

const headerProperties: HeaderProp[] = [
    {key: "zoom.us", value: "Zoom", icon: videocam},
    {key: "google.", value: "Google", icon: logoGoogle},
    {key: "meet.jit.si", value: "Jitsi"}
];

const MeetingCard: React.FC<Props> = ({name, url, edit, updateMeetings}) => {
    const [subtitle, setSubtitle] = useState("");
    const [icon, setIcon] = useState<string | undefined>();

    useEffect(() => {
        headerProperties.forEach(prop => {
            if (url.includes(prop.key)) {
                setSubtitle(prop.value);
                setIcon(prop.icon);
            }
        })
    }, [url]);

    const deleteMeeting = async (event: any) => {
        event.preventDefault();
        const currentMeetingsString: string | null = (await Storage.get({key: MEETINGS})).value;
        let currentMeetings: Meeting[] = [];
        if (currentMeetingsString) currentMeetings = JSON.parse(currentMeetingsString);
        const filteredMeetings = currentMeetings.filter(x => x.name !== name);
        await Storage.set({key: MEETINGS, value: JSON.stringify(filteredMeetings)});
        updateMeetings(filteredMeetings);
    }

    return (
        <IonCard href={edit ? "#" : url}>
            <div id="icons">
                {icon && <IonIcon icon={icon} className="large"/>}
                {edit && <IonButtons className="delete"><IonIcon slot="icon-only" icon={removeCircle} className="large"
                                                                 onClick={deleteMeeting}/></IonButtons>}
            </div>
            <IonCardHeader className={icon ? "icon" : "no-icon"}>
                <IonCardSubtitle>{subtitle}</IonCardSubtitle>
                <IonCardTitle>{name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>{url}</IonCardContent>
        </IonCard>
    );
}

export default MeetingCard;
