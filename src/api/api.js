import 'whatwg-fetch';

function getEndpointFromStatus(status) {
    let statusEndpoint;

    switch(status) {
      case 'pending':
        statusEndpoint = '/pending';
        break;
      case 'published':
        statusEndpoint = '/complete';
        break;
      case 'unpublished':
        statusEndpoint = '/unpublished';
        break;
      default:
        statusEndpoint = '/complete';
    }

    return statusEndpoint;
}

const api = {
  logout: function(apiRoot) {
    const url = apiRoot + '/account/logout';

    return fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to log out: ' + error.message
        });
      });
  },

  unpublishEnterprise: function(apiRoot, enterpriseId, enterprise) {
    const p1 = this.editEnterprise(apiRoot, enterpriseId, 'unpublished', enterprise);
    const p2 = this.deleteEnterprise(apiRoot, enterpriseId, 'published');

    return Promise.all([p1, p2]);
  },

  publishEnterprise: function(apiRoot, enterpriseId, status, enterprise) {
    const p1 = this.editEnterprise(apiRoot, enterpriseId, 'published', enterprise);
    const p2 = this.deleteEnterprise(apiRoot, enterpriseId, status);

    return Promise.all([p1, p2]);
  },

  getDirectoryAdministrators: function(apiRoot) {
    const url = apiRoot + '/directoryAdmin';

    return fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to get directory admins: ' + error.message
        });
      });
  },

  updateDirectoryAdministrators: function(apiRoot, admins) {
    const url = apiRoot + '/directoryAdmin';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(admins),
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to update directory admins: ' + error.message
        });
      });
  },

  getEnterpriseAdministrators: function(apiRoot, enterpriseId) {
    const url = apiRoot + '/enterprise/' + enterpriseId + '/admin';

    return fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to get enterprise admins: ' + error.message
        });
      });
  },

  updateEnterpriseAdministrators: function(apiRoot, enterpriseId, admins) {
    const url = apiRoot + '/enterprise/' + enterpriseId + '/admin';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(admins),
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to update enterprise admins: ' + error.message
        });
      });
  },

  getEnterpriseDetails: function(apiRoot, enterpriseId, status) {
    const statusEndpoint = getEndpointFromStatus(status);
    const url = apiRoot + '/enterprise/' + enterpriseId + statusEndpoint;

    return fetch(url, {credentials: 'include'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        if (response.status == 403) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden'
          });
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch((error) => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to get enterprise details: ' + error.message
        });
      });
  },

  deleteEnterpriseLogo: function(apiRoot, enterpriseId) {
    const url = apiRoot + '/enterprise/' + enterpriseId + '/logo';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: 'DELETE',
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to delete enterprise logo: ' + error.message
        });
      });
  },

  updateEnterpriseLogo: function(apiRoot, enterpriseId, logo, method) {
    const url = apiRoot + '/enterprise/' + enterpriseId + '/logo';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: method,
      body: JSON.stringify(logo),
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to update enterprise logo: ' + error.message
        });
      });
  },

  getEnterpriseLogo: function(apiRoot, enterpriseId) {
    const url = apiRoot + '/enterprise/' + enterpriseId + '/logo';

    return fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.blob();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to get enterprise logo: ' + error.message
        });
      });
  },

  getPermissions: function(apiRoot) {
    const url = apiRoot + '/account/permissions';

    return fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        if (response.status == 403) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden'
          });
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
    .catch(error => {
      return Promise.reject({
        status: undefined,
        message: 'Unable to get account permissions: ' + error.message
      });
    });
  },

  createEnterprise: function(apiRoot, enterprise) {
    const url = apiRoot + '/enterprise';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(enterprise),
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return response.json()
          .then(json => {
            return Promise.reject({
              status: response.status,
              message: json.errors[0].errors[0].message
            });
          });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to create enterprise: ' + error.message
        });
      });
  },

  editEnterprise: function(apiRoot, enterpriseId, enterpriseStatus, enterprise) {
    let url = apiRoot + '/enterprise/' + enterpriseId;

    if ( enterpriseStatus  && enterpriseStatus !==  'published') {
      url += '/' + getEndpointFromStatus(enterpriseStatus);
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(enterprise),
      headers: headers
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to edit enterprise: ' + error.message
        });
      });
  },

  deleteEnterprise: function(apiRoot, enterpriseId, status) {
    let statusEndpoint = getEndpointFromStatus(status);

    if (statusEndpoint === '/complete') {
      statusEndpoint = '';
    }

    const url = apiRoot + '/enterprise/' + enterpriseId + statusEndpoint;

    const request = new Request(url, {
      method: 'DELETE'
    });

    return fetch(request, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
      })
      .catch(error => {
        return Promise.reject({
          status: undefined,
          message: 'Unable to delete enterprise: ' + error.message
        });
    });
  },

  getEnterpriseSummary: function(apiRoot) {
    const url = apiRoot + '/account/enterpriseSummary';

    return fetch(url, {credentials: 'same-origin'})
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        if (response.status == 403) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden'
          });
        }

        return Promise.reject({
          status: response.status,
          message: response.statusText
        });
    })
    .catch(error => {
      return Promise.reject({
        status: undefined,
        message: 'Unable to get enterprise summary: ' + error.message
      });
    });
  }
};

export default api;
