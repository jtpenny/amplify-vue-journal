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

<template>
<div class="container" style="text-align:left">
  <b-alert variant="success" v-if="success">{{success}}</b-alert>
  <b-form>
    <h2>
      <label for="form-title"  v-if="!plaintext" >Title:</label>
      <b-form-input id="form-title" v-model="entry.title" placeholder="Title" :plaintext=plaintext></b-form-input>
    </h2>
    <label for="form-body"  v-if="!plaintext" >Body:</label>
    <div v-html="entry.body" v-if="plaintext"></div>
    <p>
    <tinymce-editor v-model="entry.body" v-if="!plaintext" :init="{menubar: 'edit format', plugins:'link'}"></tinymce-editor>
    </p>
    <p v-if="plaintext"> Created: {{ entry.createdAt | moment("MMMM Do YYYY, h:mm:ss a") }} </p> 
    <p v-if="plaintext"> Last Updated:  {{ entry.updatedAt | moment("MMMM Do YYYY, h:mm:ss a") }} </p> 
    <b-button @click="edit" variant="primary" v-if="plaintext">Edit</b-button>
    <b-button @click="remove" variant="danger" v-if="plaintext">Delete</b-button>
    <b-button @click="updateMe"  variant="primary" v-if="!plaintext">Submit</b-button> 
    <b-button @click="cancel" variant="warning" v-if="!plaintext">Cancel</b-button> 
  </b-form>
  <amplify-s3-album :path=albumPath :s3AlbumConfig=s3AlbumConfig></amplify-s3-album>
   <amplify-photo-picker :photoPickerConfig=photoPickerConfig></amplify-photo-picker>
   
</div>
</template>

<style>
.mce-notification-inner {display:none!important;}
</style>

<script>
import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'

import AmplifyStore from '../../store/store'

import  { GetEntry,UpdateEntry,DeleteEntry }  from './persist/graphqlActions';

import NotesTheme from '../NotesTheme'
import Note from './Note'
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'Notes',
  data () {
    return {
      theme: NotesTheme || {},
      note: '',
      plaintext: true,
      id: this.$route.params.id,
      photoPickerConfig: {
        path: this.$route.params.id+'/',
        storageOptions: {
          level: 'private'
        }
      },
      s3AlbumConfig: {
          level: 'private'
      },
      albumPath: this.$route.params.id+'/',
      entry: {},
      filter: 'all',
      logger: {},
      success: false,
      actions: {
        get: GetEntry,
        update:UpdateEntry,
        delete:DeleteEntry
      },
    }
  },
  created() {
    this.logger = new this.$Amplify.Logger('NOTES_component')
    this.get();
  },
  computed: {
    userId: function() { return AmplifyStore.state.userId }
  },
  components: {
    'tinymce-editor': Editor // <- Important part
  },
  methods: {
    edit() {
      this.plaintext=false;
    },
    cancel() {
      this.plaintext=true;
    },
    get() {
      console.log(this.$route.params.id)
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.get, { id : this.$route.params.id }))
      .then((res) => {
        console.log(res.data)
        this.entry = res.data.getJournal;
        this.logger.info(`Todo successfully listed`, res)
      })
      .catch((e) => {
        this.logger.error(`Error listing Todos`, e)
      });
    },
    updateMe() {
      console.log('UpdateMe');
      console.log(this.entry)
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.update, {id: this.entry.id, title: this.entry.title, body: this.entry.body }))
      .then((res) => {
        this.logger.info(`Entry updated`, res);
        this.success = 'Journal Updated.';
        this.plaintext= true;
        this.entry = res.data.updateJournal;
      })
      .catch((e) => {
        this.logger.error(`Error creating Entry`, e)
      })
    },
    remove() {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete '+this.entry.title+'.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value==true) {
              this.delete(this.entry.id);
            }
            
          })
        //  .catch(err => {
            // An error occurred
        //  })
    },
    delete(id) {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.delete, {id}))
      .then((res) => {
        this.logger.info(`Journal ${id} removed`, res);
        this.$router.push({ path: '/notes' })
      })
      .catch((e) => {
        this.logger.error(`Error removing Todo ${id}`, e)
      })
    },
    /*
    toggle(todo) {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.update, {id: todo.id, note: todo.note, done: !todo.done}))
        .then((res) => {
          todo.done = !todo.done
          this.logger.info(`Todo ${todo.id} done status toggled`, res);
        })
        .catch((e) => {
          this.logger.error(`Error toggling Todo ${todo.id} done status`, e)
        })
    },
    
    create() {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.create, {note: this.note, done: true}))
      .then((res) => {
        this.logger.info(`Todo created`, res);
        this.list();
        this.note = '';
      })
      .catch((e) => {
        this.logger.error(`Error creating Todo`, e)
      })
    }
    */
  }
}

</script>
