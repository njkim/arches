define([
    'underscore',
    'knockout',
    'views/base-manager',
    'models/project',
    'project-manager-data',
    'arches'
], function(_, ko, BaseManagerView, ProjectModel, data, arches) {
    var projects = ko.observableArray(
        data.projects.map(function (project) {
            return new ProjectModel({
                source: project,
                identities: data.identities
            });
        })
    );
    var projectFilter = ko.observable('');
    var filteredProjects = ko.computed(function () {
        var filter = projectFilter();
        var list = projects();
        if (filter.length === 0) {
            return list;
        }
        return _.filter(list, function(project) {
            return project.name().toLowerCase().indexOf(filter) > 0;
        });
    });
    var loading = ko.observable(false);
    var selectedProject = ko.observable(null);
    var pageView = new BaseManagerView({
        viewModel: {
            loading: loading,
            projects: projects,
            projectFilter: projectFilter,
            selectedProject: selectedProject,
            filteredProjects: filteredProjects,
            saveProject: function () {
                loading(true);
                var addProject = !selectedProject().get('id');
                selectedProject().save(function () {
                    if (addProject) {
                        projects.push(selectedProject());
                    }
                    loading(false);
                });
            },
            discardEdits: function () {
                if (!selectedProject().get('id')) {
                    selectedProject(null)
                } else {
                    selectedProject().reset();
                }
            },
            newProject: function () {
                if (!selectedProject() || !selectedProject().dirty()) {
                    selectedProject(new ProjectModel({
                        source: {
                            name: '',
                            active: false,
                            id: null
                        },
                        identities: data.identities
                    }));
                }
            }
        }
    });

    return pageView;
});