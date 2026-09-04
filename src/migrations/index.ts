import * as migration_20260606_103742 from './20260606_103742';
import * as migration_20260606_201437 from './20260606_201437';
import * as migration_20260607_235952 from './20260607_235952';
import * as migration_20260619_233159 from './20260619_233159';
import * as migration_20260809_173733_ui_audit_blocks from './20260809_173733_ui_audit_blocks';

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
    up: migration_20260619_233159.up,
    down: migration_20260619_233159.down,
    name: '20260619_233159',
  },
  {
    up: migration_20260809_173733_ui_audit_blocks.up,
    down: migration_20260809_173733_ui_audit_blocks.down,
    name: '20260809_173733_ui_audit_blocks',
  },
];
