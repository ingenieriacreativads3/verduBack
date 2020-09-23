import { IsDefined, IsString } from 'class-validator'
import { Schema } from 'mongoose'
import { injectable, inject } from 'inversify'

import DtoUtil from '../Util/Dto'
import Interface from './Interface'

import User from './../User/Interface'

import GeteableAll from './Ports/GeteableAll'
import TYPES from './../../../TYPES'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {}
