function initializeApp() {

    $(".alert").hide();
    const firebaseConfig = {
        apiKey: "AIzaSyAgD8XTf6Phg5bInu-D1RxW5nNSdjkZANs",
        authDomain: "medinet-827ad.firebaseapp.com",
        databaseURL: "https://medinet-827ad-default-rtdb.firebaseio.com",
        projectId: "medinet-827ad",
        storageBucket: "medinet-827ad.appspot.com",
        messagingSenderId: "52310695996",
        appId: "1:52310695996:web:2d71e891702b1aa0e92339",
        measurementId: "G-56M8KYD721",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
        z
        if (!user) {
            window.location.href = "index.html";
        } else {
            const displayName = user.displayName;
            $('#usuario').text(displayName);

            // Obter os dados personalizados do Realtime Database
            const db = firebase.firestore();
            db.collection('usuarios').get()
                .then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        if (doc.data().userId == firebase.auth().currentUser.uid) {
                            var dados = doc.data();
                            $('input[name="cad-nome"]').val(displayName);
                            if (dados.sexo == 'masculino') {
                                $('#masculino').prop('checked', true);
                            } else if (dados.sexo == 'feminino') {
                                $('#feminino').prop('checked', true);
                            }
                            $('textarea[name="cad-alergia"]').val(dados.alergia);
                        }
                    });
                    removerLoading();
                })
                .catch((error) => {
                    console.log('error', error);
                    removerLoading();
                });
        }



    });
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    });
}


