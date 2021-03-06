import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'task',
  errors: {},
  /**
   Property to keep track of recently archived tasks that can later be unarchived.
  */
  lastArchived: [],
  /**
   Content with archived content excluded.
  */
  filteredContent: function() {
    return this.get('content').filter(function(task) {
      return !task.get('archived');
    });
  }.property('content.@each.archived'),
  actions: {
    addTask: function() {
      var newTask = this.store.createRecord('task', {
        description: this.get('newDescription'),
      });
      this.setProperties({newDescription: '', errors: {}});
      if (Ember.empty(newTask.get('description'))) {
        newTask.rollback();
        this.set('errors', {task: "Your new task must have a description."});
      } else {
        newTask.save();
      }
    },
    archiveDone: function() {
      var archived = [];
      this.get('filteredContent').forEach(function(task) {
        if (task.get('done')) {
          task.set('archived', true);
          archived.push(task);
          task.save();
        }
      });
      this.set('lastArchived', archived);
    },
    undoArchive: function() {
      var tasks = this.get('lastArchived');
      if (tasks.length) {
        tasks.forEach(function(task) {
          task.set('archived', false);
          task.save();
        });
      }
      this.set('lastArchived', []);
    },
  },

});
