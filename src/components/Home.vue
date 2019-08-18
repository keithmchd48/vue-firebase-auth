<template>
    <div>
        <!-- NAVBAR -->
        <nav class="z-depth-0 grey lighten-4">
            <div class="nav-wrapper container">
                <a href="#" class="brand-logo">
                    <img src="../assets/images/logo.svg" style="width: 180px; margin-top: 10px;">
                </a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li class="logged-in">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-account">Account</a>
                    </li>
                    <li class="logged-in" @click="logout">
                        <a href="#" class="grey-text" id="logout">Logout</a>
                    </li>
                    <li class="logged-in">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-create">Create Guide</a>
                    </li>
                    <li class="logged-out">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-login">Login</a>
                    </li>
                    <li class="logged-out">
                        <a href="#" class="grey-text modal-trigger" data-target="modal-signup">Sign up</a>
                    </li>
                </ul>
            </div>
        </nav>
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
                    <button @click="submitSignUp()" class="btn yellow darken-2 z-depth-0">Sign up</button>
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
                </div>
            </div>
        </div>
        <!-- ACCOUNT MODAL -->
        <div id="modal-account" class="modal">
            <div class="modal-content center-align">
                <h4>Account details</h4><br />
                <div class="account-details"></div>
            </div>
        </div>
        <!-- CREATE GUIDE MODAL -->
        <div id="modal-create" class="modal">
            <div class="modal-content">
                <h4>Create Guide</h4><br />
                <form id="create-form">
                    <div class="input-field">
                        <input type="text" id="title" required>
                        <label for="title">Guide Title</label>
                    </div>
                    <div class="input-field">
                        <textarea id="content" class="materialize-textarea" required></textarea>
                        <label for="content">Guide Content</label>
                    </div>
                    <button class="btn yellow darken-2 z-depth-0">Create</button>
                </form>
            </div>
        </div>
        <!-- GUIDE LIST -->
        <div class="container" style="margin-top: 40px;">
            <h5 class="center-align"
                v-if="!isUserLoggedIn"
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
    export default {
        name: 'home',
        data () {
            return {
                books: [],
                isUserLoggedIn: false,
                sign_up: {
                    email: '',
                    password: ''
                },
                login: {
                    email: '',
                    password: ''
                }
            }
        },
        created () {
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.isUserLoggedIn = true;
                    this.getBooks();
                } else {
                    this.books = [];
                    this.isUserLoggedIn = false
                }
            });
        },
        methods: {
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
                if (this.sign_up.email && this.sign_up.password) {
                    // sign up the user
                    auth.createUserWithEmailAndPassword(this.sign_up.email, this.sign_up.password)
                        .then(cred => {
                            this.sign_up.email = '';
                            this.sign_up.password = '';
                            this.closeModal('#modal-signup')
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
                        })
                }
            }
        }
    }
</script>
<style>
</style>
