import cloneDeep from 'lodash/cloneDeep'
import { DEFAULT_SCHEMA } from './constants'
import { SELECT_MODEL_ACTIONS } from '@/store/lib/mixins'
const titleize = require('underscore.string/titleize')
const underscored = require('underscore.string/underscored')
const classify = require('underscore.string/classify')
const pluralize = require('pluralize')

// Schema module actions
export default {
  ...SELECT_MODEL_ACTIONS,
  selectModel: ({ commit, state }, model_id) => {
    let model = state.collection.find(m => m._id === model_id)
    commit('selectedModel', model)
    commit('attribute/collection', model.attributes, { root: true })
    commit('relation/collection', model.relations, { root: true })
  },
  create ({ state, dispatch, commit }) {
    let model = cloneDeep(state.newModel)
    dispatch('resetNewModel')
    model.label = pluralize.singular(titleize(model.label))
    commit('persist', { schema: model })
  },
  edit ({ state, commit }, schema) {
    commit('editModel', schema)
  },
  remove ({ state, commit }, schema) {
    let collection = state.collection.filter((s) => { return s._id !== schema._id })
    return commit('collection', collection)
  },
  resetNewModel ({ commit }) {
    let newModel = cloneDeep(DEFAULT_SCHEMA)
    return commit('newModel', newModel)
  },
  // TODO - leverage @codotype/util library here
  setLabel ({ state }, { schema, label }) {
    schema.label = titleize(label)
    schema.label_plural = pluralize(titleize(label))
    schema.identifier = underscored(label)
    schema.identifier_plural = underscored(pluralize(label))
    schema.class_name = classify(titleize(label))
    schema.class_name_plural = pluralize(classify(titleize(label)))
  }
}
