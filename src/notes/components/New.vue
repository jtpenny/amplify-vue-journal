<template>
  <form @submit.prevent="create">
  <input v-model="title" placeholder="Title"><br>
  <textarea  v-model="body" placeholder="Enter Entry Here..."></textarea><br>
  <button type="submit">Submit</button>
  </form>
</template>
<script>

import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'

import AmplifyStore from '../../store/store'

import  { CreateEntry }  from './persist/graphqlActions';

import NotesTheme from '../NotesTheme'

export default {
  name: 'New',
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
  methods: {
    create() {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.create, {title: this.title, body: this.body }))
      .then((res) => {
        this.logger.info(`Entry created`, res);
      })
      .catch((e) => {
        this.logger.error(`Error creating Entry`, e)
      })
    }
  }
}

</script>