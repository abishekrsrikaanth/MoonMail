'use strict';

import { List } from 'moonmail-models';
import { debug } from '../../lib/logger';
import cuid from 'cuid';
import decrypt from '../../lib/auth-token-decryptor';
import { ApiErrors } from '../../lib/errors';

export function respond(event, cb) {
  debug('= createEmailList.action', JSON.stringify(event));
  decrypt(event.authToken).then((decoded) => {
    if (event.list) {
      let list = event.list;
      list.userId = decoded.sub;
      list.id = cuid();
      list.isDeleted = false.toString();
      list.importStatus = {};
      List.save(list).then(() => {
        return cb(null, list);
      }).catch(e => {
        debug(e);
        return cb(ApiErrors.response(e));
      });
    } else {
      return cb(ApiErrors.response('No list specified'));
    }
  }).catch(err => cb(ApiErrors.response(err), null));
}
