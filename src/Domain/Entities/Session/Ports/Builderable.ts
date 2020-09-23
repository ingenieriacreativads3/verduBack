import Responseable from '../../Util/Ports/Responseable'

export default interface Builderable {
  getInstance(requiered: any[]): Promise<Responseable>
}