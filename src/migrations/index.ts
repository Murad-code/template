import * as migration_20260606_103742 from './20260606_103742';
import * as migration_20260606_201437 from './20260606_201437';
import * as migration_20260607_235952 from './20260607_235952';
import * as migration_20260613_225500_add_root_role from './20260613_225500_add_root_role';
import * as migration_20260614_000235 from './20260614_000235';

export const migrations = [
  {
    up: migration_20260606_103742.up,
    down: migration_20260606_103742.down,
    name: '20260606_103742',
  },
  {
    up: migration_20260606_201437.up,
    down: migration_20260606_201437.down,
    name: '20260606_201437',
  },
  {
    up: migration_20260607_235952.up,
    down: migration_20260607_235952.down,
    name: '20260607_235952',
  },
  {
    up: migration_20260613_225500_add_root_role.up,
    down: migration_20260613_225500_add_root_role.down,
    name: '20260613_225500_add_root_role',
  },
  {
    up: migration_20260614_000235.up,
    down: migration_20260614_000235.down,
    name: '20260614_000235'
  },
];
