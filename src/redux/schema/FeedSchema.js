import {normalize, schema} from 'normalizr';

export const user = new schema.Entity('users', {}, {idAttribute: '_id'});
export const community = new schema.Entity(
  'communities',
  {},
  {idAttribute: '_id'},
);
export const post = new schema.Entity(
  'posts',
  {
    author: user,
    community: community,
  },
  {idAttribute: '_id'},
);
