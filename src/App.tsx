import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { add, cog, people } from 'ionicons/icons';
import firebase from 'firebase/app';
import Meetings from './pages/Meetings';
import Settings from './pages/Settings';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import Add from './pages/Add';
import Login from './pages/Login';
import { firebaseConfig } from './firebase-config';

const App: React.FC = () => {
	useEffect(() => {
		firebase.initializeApp(firebaseConfig);
	}, []);
	
	return <IonApp>
		<IonReactRouter>
			<IonTabs>
				<IonRouterOutlet>
					<Route path="/meetings" component={ Meetings } exact/>
					<Route path="/add" component={ Add } exact/>
					<Route path="/settings" component={ Settings } exact/>
					<Route path="/login" component={ Login } exact/>
					<Route path="/" render={ () => <Redirect to="/meetings"/> } exact/>
				</IonRouterOutlet>
				<IonTabBar slot="bottom">
					<IonTabButton tab="meetings" href="/meetings">
						<IonIcon icon={ people }/>
						<IonLabel>Meetings</IonLabel>
					</IonTabButton>
					<IonTabButton tab="add" href="/add">
						<IonIcon icon={ add }/>
						<IonLabel>Add</IonLabel>
					</IonTabButton>
					<IonTabButton tab="settings" href="/settings">
						<IonIcon icon={ cog }/>
						<IonLabel>Settings</IonLabel>
					</IonTabButton>
				</IonTabBar>
			</IonTabs>
		</IonReactRouter>
	</IonApp>;
};

export default App;
