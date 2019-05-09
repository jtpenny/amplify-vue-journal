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
  <ul>
  <li v-for="(value, key) in entry"> {{key}}:  {{ value }} </li>
  </ul>
</template>
<script>
import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'

import AmplifyStore from '../../store/store'

import  { ListEntries }  from './persist/graphqlActions';

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
        list: ListEntries,
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
      
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.list, { id : this.$route.params.id }))
      .then((res) => {
        console.log(res.data)
        this.entry = res.data.listJournals.items[0];
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
