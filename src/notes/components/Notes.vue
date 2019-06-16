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
  <b-container :style="theme.container">
    <h2 :style="theme.header">Notes</h2>
    <router-link :to="'/note/create'" tag="b-button">New Entry</router-link><br>
      <b-row v-for="(entry,index) in journalEntries" v-bind:key="entry.id" >
        <b-col md="3" />
        <b-col md="3 entry" :class="{even: index % 2, odd: !(index % 2)}"><router-link :to="'/note/'+entry.id">{{ entry.title }}</router-link></b-col>
        <b-col md="3 entry" :class="{even: index % 2, odd: !(index % 2)}"> {{ entry.createdAt | moment("MMMM Do YYYY, h:mm:ss a") }} </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>
	.entry {
		text-align:left;
		padding:12px;
	}
	
	.even {
		background-color: #eeeeee;	
	}
	
	.odd {
		background-color: white;
	}
</style>

<script>
import Vue from 'vue'
import { Logger } from 'aws-amplify'
import { JS } from 'fsts'
import moment from 'moment'

import AmplifyStore from '../../store/store'

import  { ListEntries }  from './persist/graphqlActions';

import NotesTheme from '../NotesTheme'



export default {
  name: 'Notes',
  data () {
    return {
      theme: NotesTheme || {},
      journalEntries: [],
      filter: 'all',
      logger: {},
      actions: {
        list: ListEntries,
      },
    }
  },
  created() {
    this.logger = new this.$Amplify.Logger('NOTES_component')
    this.list();
  },
  computed: {
    userId: function() { return AmplifyStore.state.userId }
  },
  methods: {
    list() {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(this.actions.list))
      .then((res) => {
        this.journalEntries = _.orderBy(res.data.userJournals.items, 'createdAt','desc');
        this.logger.info(`Entries successfully listed`, res)
      })
      .catch((e) => {
        this.logger.error(`Error listing Todos`, e)
      });
    },
    
  }
}
</script>
