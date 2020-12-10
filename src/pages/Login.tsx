import React, { useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Login.scss';

const Login: React.FC = () => {
	
	const submitRef = useRef<HTMLIonButtonElement>(null);
	const [ mode, setMode ] = useState<'login' | 'register'>('login');
	
	const login = (e: React.FormEvent) => {
		e.preventDefault();
		alert('Login');
	};
	
	const handleSubmit = (e: any, action: 'next' | 'submit') => { //TODO replace any with correct event type
		if (e.key === 'Enter') {
			switch (action) {
				case 'next':
					//TODO focus next
					break;
				case 'submit':
					submitRef.current?.click();
					break;
			}
		}
	};
	
	const switchMode = () => {
		setMode(current => current === 'login' ? 'register' : 'login');
	};
	
	return (
		<IonPage id="settings-page">
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start"><IonBackButton defaultHref={ '/Settings' }/></IonButtons>
					<IonTitle>{ mode === 'login' ? 'Login' : 'Register' }</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent scrollY={ false }>
				<form onSubmit={ login }>
					<IonList style={ { borderRadius: 10 } }>
						<IonItem>
							<IonLabel position="floating">Username</IonLabel>
							<IonInput type="text" autocomplete="username" autofocus clearInput enterkeyhint="next" name="username" required onKeyDown={ (e) => handleSubmit(e, 'next') }/>
						</IonItem>
						<IonItem>
							<IonLabel position="floating">
								Password
							</IonLabel>
							<IonInput type="password" clearInput clearOnEdit={ false } enterkeyhint={ 'done' } minlength={ 6 } name="password" required onKeyDown={ (e) => handleSubmit(e, mode === 'login' ? 'submit' : 'next') }/>
						</IonItem>
						{ mode === 'register' && <IonItem>
                            <IonLabel position="floating">
                                Repeat password
                            </IonLabel>
                            <IonInput type="password" clearInput clearOnEdit={ false } enterkeyhint={ 'done' } minlength={ 6 } name="repeatPassword" required onKeyDown={ (e) => handleSubmit(e, 'submit') }/>
                        </IonItem> }
						<IonButton expand="block" className="ion-margin" type="submit" ref={ submitRef }>Login</IonButton>
						<IonItem lines="none">
							<IonLabel color="primary" className={ 'ion-margin ' + mode } onClick={ switchMode }>{ mode === 'login' ? 'Noch nicht registriert?' : 'Schon registriert?' }</IonLabel>
						</IonItem>
					</IonList>
				</form>
			</IonContent>
		</IonPage>
	);
};

export default Login;
