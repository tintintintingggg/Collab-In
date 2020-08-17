import React from 'react';
import {LoadingPage} from '../LoadingPage';
import {db, storage} from '../../utils/firebase';
// redux
import {connect} from 'react-redux';

class AccountSetting extends React.Component{
    constructor(props){
        super(props);
    }
    chancgProfile(e){
        let file = e.target.files[0];
        let currentUser = this.props.user;
        let storageRef = storage.ref(currentUser.uid+'/'+file.name);
        storageRef.put(file)
        .then(()=>{
            return storageRef.getDownloadURL();
        }).then((url)=>{
            return currentUser.updateProfile({photoURL: url});
        }).then(()=>{
            this.props.updateUserData({
                username: currentUser.displayName,
                photoURL: currentUser.photoURL
            });
        }).catch(()=>{console.log(error.message);});
    }
    
    render(){
        if(!this.props.userData){
            return <LoadingPage />
        }else{
            return <div className="account-setting">
                <div className="user-photo">
                    <div style={{backgroundImage: `url(${this.props.userData.photoURL})`}}></div>
                    <div id="photo-edit">
                        <label htmlFor="img-uploader">
                            <img src="/images/change-profile.png" />
                        </label>
                        <input 
                            type="file" id="img-uploader" name="img" accept="image/*"
                            onChange={this.chancgProfile.bind(this)} 
                         />
                    </div>
                </div>
                <div className="user-name">
                    <div>Dear, <span id="username">{this.props.userData.username}</span></div>
                </div>
            </div>
        }
    }
}

const mapStateToProps = (store)=>{
    return{user: store.userReducer.user};
};
export default connect(mapStateToProps)(AccountSetting);