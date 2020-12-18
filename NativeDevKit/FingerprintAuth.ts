import $ from 'jquery';
import { Plugins } from '@capacitor/core';

import 'capacitor-secure-storage-plugin';

const { SecureStoragePlugin } = Plugins;

var Fingerprint = (window as any).Fingerprint;

function ShowFingerprintForResult(): Promise<any> {
    return new Promise((resolve, reject) => {
        Fingerprint.show({
            description: "Some biometric description"
          }, resolve, reject);
    });
}

function CheckForFingerprint(): Promise<any> {
    return new Promise((resolve, reject) => {
        Fingerprint.isAvailable(resolve, reject, {});
    });
}

async function TryLoginWithFingerprint() {
    const old_display = $('#card-login-colors').css('display');
    $('#card-login-colors').css('display', 'none');
    try {
        await CheckForFingerprint();
        const usernamePromise = SecureStoragePlugin.get({key: 'username'});
        const passwordPromise = SecureStoragePlugin.get({key: 'password'});
        await ShowFingerprintForResult();


        const [username, password] = await Promise.all([usernamePromise, passwordPromise]);
        $('#usernameField').val(username.value);
        $('#passwordField').val(password.value);

        const form = $("form[action='/Account/LogOn']");
        form.unbind('submit').submit();
    } catch (e) {
        $('#card-login-colors').css('display', old_display);
        console.error("NU A MERS!", e);
    }
}



$(document).ready(function() {
    if ($('.fintech-login-section').length) {
        const form = $("form[action='/Account/LogOn']");
        if (form.length) {
            TryLoginWithFingerprint();
            
            form.submit(async function(e) {
                e.preventDefault();
                const usernameField = $("form[action='/Account/LogOn']").serializeArray().find(e => e.name == "UserName");
                const passwordField = $("form[action='/Account/LogOn']").serializeArray().find(e => e.name == "Password");
                
                var _this = $(this); //store form so it can be accessed later
                await SecureStoragePlugin.set({key: 'username', value: usernameField?.value ?? ""})
                await SecureStoragePlugin.set({key: 'password', value: passwordField?.value ?? ""})
                _this.unbind("submit").submit();
            }); 
        }
    } else {
        //
    }
});