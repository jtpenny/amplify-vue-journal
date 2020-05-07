/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import Vue from 'vue';
import Router from 'vue-router';
import { Menu, Home, Profile } from '@/components';
import { Notes, Note, New as NewNote } from '@/notes';
import { components, AmplifyEventBus, AmplifyPlugin } from 'aws-amplify-vue';
import Amplify, * as AmplifyModules from 'aws-amplify';
import AmplifyStore from '../store/store';

import { SocialAuth,SocialAuthCallback} from 'amplify-vue-social-auth';


Vue.use(Router);
Vue.use(AmplifyPlugin, AmplifyModules);

let user;

getUser().then((user, error) => {
  if (user) {
    router.push({path: '/'})
  }
})


AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut'){
    user = null;
    AmplifyStore.commit('setUser', null);
    router.push({path: '/auth'})
  } else if (state === 'signedIn') {
    user = await getUser();
    router.push({path: '/'})
  }
});

function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      AmplifyStore.commit('setUser', data);
      return data;
    } 
  }).catch((e) => {
    AmplifyStore.commit('setUser', null);
    return null
  });
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true}
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes,
      meta: { requiresAuth: true}
    },
    {
      path: '/note/create',
      name: 'NewNote',
      component: NewNote,
      meta: { requiresAuth: true}
    },
    {
      path: '/note/:id',
      name: 'Note',
      component: Note,
      meta: { requiresAuth: true}
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu,
      meta: { requiresAuth: true}
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true}
    },
    {
      path: '/auth',
      name: 'Authenticator',
      component: SocialAuth
    },
    {
      path: '/callback',
      name: 'callback',
      component: SocialAuthCallback,
      meta: { requiresAuth: false}
    }
  ]
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: '/auth',
        query: {
          redirect: to.fullPath,
        }
      });
    }
    return next()
  }
  return next()
})

export default router
