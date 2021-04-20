import React, { useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import 'firebase/auth';
import './Login.scss';
import firebase from 'firebase';
import { RouteComponentProps } from 'react-router';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
	
	const submitRef = useRef<HTMLIonButtonElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [ mode, setMode ] = useState<'login' | 'register'>('login');
	const [ errorToast, setErrorToast ] = useState<string | undefined>(undefined);
	const [ toast, setToast ] = useState<string | undefined>(undefined);
	
	const login = (e: React.FormEvent) => {
		e.preventDefault();
		const data: { username: string, password: string, repeatPassword?: string } = Object.fromEntries(new FormData(formRef.current!).entries()) as any;
		if (mode === 'login') {
			firebase.auth().signInWithEmailAndPassword(data.username, data.password).then(res => {
				setToast(`${ res.user?.email } logged in successfully!`);
				history.push('/', null);
			}).catch(res => {
				setErrorToast(res.message);
			});
		} else if (data.password === data.repeatPassword) {
			firebase.auth().createUserWithEmailAndPassword(data.username, data.password).then(res => {
				res.user?.sendEmailVerification();
				setToast(`${ res.user?.email } registered successfully!`);
				history.push('/', null);
			}).catch(res => {
				setErrorToast(res.message);
			});
		} else {
			setErrorToast('The password and repeatPassword have to match!');
		}
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
				<form onSubmit={ login } ref={ formRef }>
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
						<IonButton expand="block" className="ion-margin" type="submit" ref={ submitRef }>{ mode === 'login' ? 'Login' : 'Register' }</IonButton>
						<IonItem lines="none">
							<IonLabel color="primary" className={ 'ion-margin ' + mode } onClick={ switchMode }>{ mode === 'login' ? 'Noch nicht registriert?' : 'Schon registriert?' }</IonLabel>
						</IonItem>
					</IonList>
				</form>
				<IonToast isOpen={ !!errorToast } color="danger" buttons={ [ { text: 'OK', role: 'cancel' } ] } message={ errorToast } duration={ 6000 } onDidDismiss={ () => setToast(undefined) }/>
				<IonToast isOpen={ !!toast } color="light" buttons={ [ { text: 'OK', role: 'cancel' } ] } message={ toast } duration={ 6000 } onDidDismiss={ () => setToast(undefined) }/>
			</IonContent>
		</IonPage>
	);
};

export default Login;
