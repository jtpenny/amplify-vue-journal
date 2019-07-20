<template>

<div class="container" style="text-align:left;">
  <b-form @submit.prevent="create">
    <b-form-group label="Title:" label-for="form-title">
      <b-form-input id="form-title" v-model="title" placeholder="Title"></b-form-input>
    </b-form-group>
    <b-form-group label="Body:" label-for="form-body">
      <tinymce-editor v-model="body" :init="{menubar: 'edit format insert', plugins: 'wordcount',baseURL:'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.0.11/'}"></tinymce-editor>
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</div>
</template>

<style>


button { 
  margin:12px;
}
</style>

<script>

import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'

import AmplifyStore from '../../store/store'

import  { CreateEntry }  from './persist/graphqlActions';

import NotesTheme from '../NotesTheme'
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'New',
  editor: Editor,
  data () {
    return {
      theme: NotesTheme || {},
      title: '',
      body: '',
      filter: 'all',
      logger: {},
      actions: {
        create: CreateEntry
      },
    }
  },
  created() {
     this.logger = new this.$Amplify.Logger('NOTES_component')
     this.logger.info('Create Page Loaded');
    
  },
  computed: {
    userId: function() { return AmplifyStore.state.userId }
  },
  components: {
    'tinymce-editor': Editor // <- Important part
  },
  methods: {
    create() {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.create, {title: this.title, body: this.body }))
      .then((res) => {
        this.logger.info(`Entry created`, res);
        this.$router.push({ path: '/note/'+res.data.createJournal.id })
      })
      .catch((e) => {
        this.logger.error(`Error creating Entry`, e)
      })
    }
  }
}

</script>