import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { thoughts } from '../../helpers'

export const dayTwoMountain: Scene = {
  id: SCENE_IDS.DAY_TWO_MOUNTAIN,
  day: 2,
  title: 'Montagne',
  entryAnnotation: 'Arrivée à la montagne',
  entryAudioEarlyStart: true,
  terminal: true,
  condition: { flag: 'callChoice', operator: 'equals', value: 'refuse' },
  audio: 'experience/J02_S02_Montagne.mp3',
  dialogues: [
    thoughts(
      'd2_8',
      "C'est une mésange boréale, ça, elles sont magnifiques !",
      {
        color: 'blue',
      }
    ),
    thoughts(
      'd2_9',
      "J'ai pas l'habitude de venir en Belledonne et on ose me dire qu'il en faut beaucoup pour m'impressionner, alors qu'il suffit littéralement d'un tas de cailloux, des arbres et des beaux nuages. Ça fait tellement de bien, je retrouve mon oxygène.",
      {
        color: 'blue',
      }
    ),
    thoughts(
      'd2_10',
      "Trop longtemps que je décale, que je prends pas de temps pour moi, mais je suis importante aussi. Je vous aime, mais j'ai aussi besoin de temps pour me retrouver. Je vous écoute, je vous donne, je ressens vos émotions plus que vous ne pourriez l'imaginer. Et c'est ma bénédiction en réalité. Ça m'a donné des amis, des liens, des relations, des aventures véritables que je suis vraiment reconnaissante d'avoir. Viendra un jour où j'aurai le courage, où je leur raconterai que je vois la vie en mille couleurs, en mille sons, la forme et la profondeur de leur voix et de leurs expressions. Je leur raconterai que parfois, le silence résonne fort comme un cri. Et je leur raconterai, je vous raconterai, le plaisir d'être réellement comprise, de ne pas se sentir anormale, mais simplement différente, d'avoir la tête et le cœur qui s'emballent tout le temps. La vie a plus de goût, même s'il est parfois amer.",
      {
        color: 'blue',
        isCompact: true,
      }
    ),
  ],
}
