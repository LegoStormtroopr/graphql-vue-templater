import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import { gql_request } from './graphql.js'

Vue.component("liveupdater", {
    data: function () {
      return {
        msg: 'hello',
        template: null
      }
    },
    props: ['templateCode', 'dataCode'],
    render: function(createElement) {
      console.log("this.templateCode")
      console.log(this.templateCode)
      if (!this.templateCode || !this.dataCode) {
        return createElement('div', 'Loading...');
      } else {
        this.result = this.dataCode //JSON.parse(this.dataCode.output)
        this.x = Vue.compile(this.templateCode).render;
        console.log(this.x)
        console.log(this.x())
        return this.x();
      }
    },
    mounted() {
    }

});

Vue.component("graphqlbuilder", {
    data: function () {
      return {
        output: "",
        error_message: "",
        dataResult: "",
        gql_query: `query {
  metadata (first: 5) {
    edges {
      node {
        name
        definition
      }
    }
  }
}`,
      }
    },
    // props: ['gql_query'],
    template: `<div>
        <div class="col-6">
          <button class="btn btn-primary" v-on:click="run_query()">Update query</button>
          <div><textarea class="w-100" v-model="gql_query">{{gql_query}}</textarea></div>
        </div>
        <div class="col-6" style="max-height:400px;overflow:scroll;">
          <pre>{{dataResult}}</pre>
        </div>
    </div>`,
    methods: {
      run_query: function() {
        console.log(this.gql_query)
        var currentvue = this

        gql_request(
          vm.baseurl,
          currentvue.gql_query, 
          function(data) {
            currentvue.dataResult = data
            currentvue.value = data
            console.log(data)
            console.log(currentvue.dataResult)
            currentvue.loading = false
            currentvue.$emit('result_updated', currentvue.dataResult)
          },
          function(error) {
            currentvue.error_message = "Request could not be completed"
            currentvue.loading = false
          }
        )

      }
    }
    // render: function(createElement) {
    //   console.log("this.templateCode")
    //   console.log(this.templateCode)
    //   if (!this.templateCode) {
    //     return createElement('div', 'Loading...');
    //   } else {
    //     this.result = JSON.parse(this.dataCode)
    //     this.x = Vue.compile(this.templateCode).render;
    //     console.log(this.x)
    //     console.log(this.x())
    //     return this.x();
    //   }
    // },
    // mounted() {
    // }

});

var vm = new Vue({
  el: '#vue',
  data: {
    display_data: {},
    seen_uuids: [],
    template_code: `<div><h1>Some stuff</h1>
    <ul>
      <li v-for="edge in result.data.metadata.edges">
        {{edge.node.name}}
      </li>
    </ul>
    <div>
    `,
    baseurl: 'registry.aristotlemetadata.com',
    search_text: '',
    display_name: '',
    graphqlresult: '',
    loading: true,
    search_loading: false,
    search_results: {},
    search_display: false,
    display_info: {},
    error_message: '',
  },
  mounted: function() {
    // this.initGraph()
  },
  // computed: {
    // prettymap: function() {
    //   var pmap = {}
    //   for (var key in this.colormap) {
    //     var newkey = this.uncamel(key)
    //     pmap[newkey] = this.colormap[key]
    //   }
    //   return pmap
    // }
  // },
  methods: {
    update_result: function(result) {
      this.graphqlresult = result
    },
    update_graphql: function() {
      this.loading = true
      var currentvue = this
      // this.output = this.data_code + this.template_code
      var res = Vue.compile(this.template_code)
      // var data = JSON.parse('')
      var v = new Vue.component('ff', {
        data: {"name":"world"},
        render: res.render,
        staticRenderFns: res.staticRenderFns
      })
      // this.output = v
      console.log(v, res, res.render)


    },
    request: function() {
      // Request the current uuid and display it if successfull
      this.loading = true
      var currentvue = this
      gql_request(
        this.baseurl,
        currentvue.uuid_input, 
        function(data) {
          // console.log(data)
          if ('datasetSpecifications' in data['data']) {
            currentvue.reset_data()
            currentvue.dfs(data['data'], null, 'datasetSpecification')
            currentvue.display_name = data['data']['datasetSpecifications']['edges'][0]['node']['name']
          } else {
            currentvue.error_message = "Not a valid Dataset UUID"
          }
          currentvue.loading = false
        },
        function(error) {
          currentvue.error_message = "Request could not be completed"
          currentvue.loading = false
        }
      )
    }
  }
});
