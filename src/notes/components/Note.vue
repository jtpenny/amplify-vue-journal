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
  <h2> {{ entry.title }} </h2>
  <p style="white-space: pre-wrap;"> {{ entry.body }} </p>
  <p> Created: {{ entry.createdAt | moment("MMMM Do YYYY, h:mm:ss a") }} </p> 
  <p> Last Updated:  {{ entry.updatedAt | moment("MMMM Do YYYY, h:mm:ss a") }} </p> 
  
</div>
</template>
<script>
import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'

import AmplifyStore from '../../store/store'

import  { GetEntry }  from './persist/graphqlActions';

import NotesTheme from '../NotesTheme'
import Note from './Note'

export default {
  name: 'Notes',
  data () {
    return {
      theme: NotesTheme || {},
      note: '',
      entry: {},
      filter: 'all',
      logger: {},
      actions: {
        get: GetEntry,
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
  methods: {
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
    }
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
    remove(id) {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.delete, {id}))
      .then((res) => {
        this.logger.info(`Todo ${id} removed`, res);
        this.list();
      })
      .catch((e) => {
        this.logger.error(`Error removing Todo ${id}`, e)
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
