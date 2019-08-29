<template>
    <div>
        <!-- NAVBAR -->
        <nav class="z-depth-0 grey lighten-4" v-if="!loader">
            <div class="nav-wrapper container">
                <a href="#" class="brand-logo">
                    <img src="../assets/images/logo.svg" style="width: 180px; margin-top: 10px;">
                </a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li class="logged-in" v-if="isUserLoggedIn">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-account">Account</a>
                    </li>
                    <li class="logged-in" v-if="isUserLoggedIn" @click="logout">
                        <a href="#" class="grey-text" id="logout">Logout</a>
                    </li>
                    <li class="logged-in" v-if="isUserLoggedIn && userInfo.isAdmin">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-create">Create Book</a>
                    </li>
                    <li class="logged-out" v-if="!isUserLoggedIn">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-login">Login</a>
                    </li>
                    <li class="logged-out" v-if="!isUserLoggedIn">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-signup">Sign up</a>
                    </li>
                </ul>
            </div>
        </nav>
        <!-- ADMIN ACTIONS -->
        <div v-if="isUserLoggedIn && userInfo.isAdmin" class="center-align admin-actions" style="margin: 40px auto; max-width: 300px;">
            <input type="email" placeholder="User email" id="admin-email"
                   v-model="admin.email"
            />
            <button @click="addAdminRole" class="btn-small yellow darken-2 z-depth-0">Make admin</button>
        </div>
        <!-- SIGN UP MODAL -->
        <div id="modal-signup" class="modal">
            <div class="modal-content">
                <h4>Sign up</h4><br />
                <div id="signup-form">
                    <div class="input-field">
                        <input type="text" id="signup-email"
                               v-model="sign_up.email"
                        />
                        <label for="signup-email">Email address</label>
                    </div>
                    <div class="input-field">
                        <input type="password" id="signup-password"
                               v-model="sign_up.password"
                        />
                        <label for="signup-password">Choose password</label>
                    </div>
                    <div class="input-field">
                        <input type="text" id="signup-bio"
                               v-model="sign_up.bio"
                        />
                        <label for="signup-bio">One Line Bio</label>
                    </div>
                    <button @click="submitSignUp()" class="btn yellow darken-2 z-depth-0">Sign up</button>
                    <p v-if="errorMsg" class="error pink-text center-align">{{errorMsg}}</p>
                </div>
            </div>
        </div>
        <!-- LOGIN MODAL -->
        <div id="modal-login" class="modal">
            <div class="modal-content">
                <h4>Login</h4><br />
                <div id="login-form">
                    <div class="input-field">
                        <input type="text" id="login-email"
                               v-model="login.email"
                        />
                        <label for="login-email">Email address</label>
                    </div>
                    <div class="input-field">
                        <input type="password" id="login-password"
                               v-model="login.password"
                        />
                        <label for="login-password">Your password</label>
                    </div>
                    <button @click="loginFunction" class="btn yellow darken-2 z-depth-0">Login</button>
                    <p v-if="errorMsg" class="error pink-text center-align">{{errorMsg}}</p>
                </div>
            </div>
        </div>
        <!-- ACCOUNT MODAL -->
        <div id="modal-account" class="modal">
            <div class="modal-content center-align">
                <h4>Account details</h4><br />
                <div class="account-details">
                    <div>{{userInfo.email ? 'Logged In As ' + userInfo.email : ''}}</div>
                    <div>{{userInfo.bio ? userInfo.bio : ''}}</div>
                    <div>{{userInfo.isAdmin ? 'Admin' : ''}}</div>
                </div>
            </div>
        </div>
        <!-- CREATE BOOK MODAL -->
        <div id="modal-create" class="modal">
            <div class="modal-content">
                <h4>Create Book</h4><br />
                <div id="create-form">
                    <div class="input-field">
                        <input type="text" id="title" v-model="book.bookTitle">
                        <label for="title">Book Title</label>
                    </div>
                    <div class="input-field">
                        <textarea id="content" class="materialize-textarea" v-model="book.bookAuthor"></textarea>
                        <label for="content">Book Author</label>
                    </div>
                    <button @click="addBook" class="btn yellow darken-2 z-depth-0">Create</button>
                </div>
            </div>
        </div>
        <!-- GUIDE LIST -->
        <div class="container" style="margin-top: 40px;">
            <h5 class="center-align"
                v-if="!isUserLoggedIn && !loader"
            >Login to view Books
            </h5>
            <ul v-else="" class="collapsible z-depth-0 guides" style="border: none;">
                <li v-for="book in books" :key="book.id">
                    <div class="collapsible-header grey lighten-4">{{book.title}}</div>
                    <div class="collapsible-body white">{{book.author}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    // setup materialize components
    document.addEventListener('DOMContentLoaded', function() {

        let modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);

        let items = document.querySelectorAll('.collapsible');
        M.Collapsible.init(items);

    });
    import {auth} from '../main'
    import {db} from '../main'
    import {func} from '../main'
    export default {
        name: 'home',
        data () {
            return {
                loader: true,
                errorMsg: '',
                books: [],
                userInfo: {
                    email: '',
                    bio: '',
                    isAdmin: false
                },
                isUserLoggedIn: false,
                sign_up: {
                    email: '',
                    password: '',
                    bio: ''
                },
                login: {
                    email: '',
                    password: ''
                },
                book: {
                    bookTitle: '',
                    bookAuthor: ''
                },
                admin: {
                    email: ''
                }
            }
        },
        created () {
            auth.onAuthStateChanged(user => {
                if (user) {
                    user.getIdTokenResult().then(idTokenRes => {
                        this.userInfo.isAdmin = idTokenRes.claims.admin
                    });
                    db.collection('users').doc(user.uid).get().then(doc => {
                        this.userInfo.bio = doc.data().bio
                    });
                    this.userInfo.email = user.email;
                    this.isUserLoggedIn = true;
                    this.getBooks();
                } else {
                    this.books = [];
                    this.isUserLoggedIn = false
                }
                this.loader = false
            });
        },
        methods: {
            addAdminRole () {
                const addAdminRole = func.httpsCallable('addAdminRole');
                addAdminRole({email: this.admin.email})
                    .then(res => {
                        alert(`${res.data.message}`);
                    })
            },
            addBook () {
                if (this.book.bookTitle && this.book.bookAuthor) {
                    db.collection('books_tbl').add({
                        title: this.book.bookTitle,
                        author: this.book.bookAuthor
                    }).then(resp => {
                        this.book.bookTitle = '';
                        this.book.bookAuthor = '';
                        this.closeModal('#modal-create');
                        this.getBooks();
                    }).catch(err => {
                        alert(err.message)
                    })
                }
            },
            getBooks () {
                let items = [];
                db.collection('books_tbl').get()
                    .then(snapShot => {
                        snapShot.forEach(eachDoc => {
                            items.push({
                                id: eachDoc.id,
                                title: eachDoc.data().title,
                                author: eachDoc.data().author
                            });
                        });
                        this.books = items
                    })
            },
            closeModal (modal_name) {
                const modal = document.querySelector(modal_name);
                M.Modal.getInstance(modal).close();
            },
            submitSignUp () {
                if (this.sign_up.email && this.sign_up.password && this.sign_up.bio) {
                    // sign up the user
                    auth.createUserWithEmailAndPassword(this.sign_up.email, this.sign_up.password)
                        .then(cred => {
                            return db.collection('users').doc(cred.user.uid).set({
                                bio: this.sign_up.bio
                            });
                        }).then(() => {
                        this.sign_up.email = '';
                        this.sign_up.password = '';
                        this.sign_up.bio = '';
                        this.errorMsg = '';
                        this.closeModal('#modal-signup')
                    }).catch(err => {
                        this.errorMsg = err;
                        setTimeout(() => {
                            this.errorMsg = ''
                        }, 5000)
                    });
                }
            },
            logout () {
                if (this.isUserLoggedIn) {
                    auth.signOut()
                        .then(() => {
                            alert('User has Signed out!!')
                        })
                }
            },
            loginFunction () {
                if (this.login.email && this.login.password) {
                    auth.signInWithEmailAndPassword(this.login.email, this.login.password)
                        .then((cred) => {
                            this.login.email = '';
                            this.login.password = '';
                            this.closeModal('#modal-login')
                        }).catch(err => {
                        this.errorMsg = err;
                        setTimeout(() => {
                            this.errorMsg = ''
                        }, 5000)
                    });
                }
            }
        }
    }
</script>
<style>
</style>
