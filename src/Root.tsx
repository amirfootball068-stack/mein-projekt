import React from "react";
import {Composition} from "remotion";
import {Testbild} from "./testbild/Testbild";
import {EinProzent, DAUER as BSP_DAUER} from "./beispiel/EinProzent";
import {MeinVideo, MEIN_VIDEO_DAUER} from "./video/MeinVideo";
import {Profilbild} from "./profilbild/Profilbild";
import {Folge1, FOLGE1_DAUER} from "./serie/folge1/Folge1";
import {GtaVideo1, GTA1_DAUER} from "./gta/video1/GtaVideo1";
import {GtaVideo2, GTA2_DAUER} from "./gta/video2/GtaVideo2";

const FPS = 30;
const hochkant = {width: 1080, height: 1920, fps: FPS};

export const Root: React.FC = () => (
  <>
    {/* Dein Video */}
    <Composition id="MeinVideo" component={MeinVideo} durationInFrames={Math.ceil(MEIN_VIDEO_DAUER * FPS)} {...hochkant} />
    {/* GTA-Account, Video 1 */}
    <Composition id="GtaVideo1" component={GtaVideo1} durationInFrames={Math.ceil(GTA1_DAUER * FPS)} {...hochkant} />
    <Composition id="GtaVideo2" component={GtaVideo2} durationInFrames={Math.ceil(GTA2_DAUER * FPS)} {...hochkant} />
    {/* Serie „Die perfekte Açaí-Bowl“ (Instagram Reels) */}
    <Composition id="Folge1" component={Folge1} durationInFrames={Math.ceil(FOLGE1_DAUER * FPS)} {...hochkant} />
    {/* Profilbild fuer TikTok (quadratisch) */}
    <Composition id="Profilbild" component={Profilbild} durationInFrames={1} width={1080} height={1080} fps={FPS} />
    {/* Testbild: zeigt, ob alles eingerichtet ist */}
    <Composition id="Testbild" component={Testbild} durationInFrames={5 * FPS} {...hochkant} />
    {/* Beispielvideo aus dem Kurs */}
    <Composition
      id="EinProzent"
      component={EinProzent}
      durationInFrames={Math.round(BSP_DAUER * FPS)}
      {...hochkant}
      defaultProps={{ton: true, fassung: "final" as const}}
    />
  </>
);
