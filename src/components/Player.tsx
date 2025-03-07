import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

const Player = () => {
  const { animations, scene } = useLoader(
    GLTFLoader,
    "/project_playtime_player.glb"
  );
  const { actions } = useAnimations(animations, scene);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const movement = useRef({ forward: 0, strafe: 0 });

  // Actions --------------------------------
  const idleAction = actions["SK_PlayerDefault.ao|A_Player_BasePose"];
  const runAction = actions["SK_PlayerDefault.ao|A_Player_Run"];
  const strafeRightAction =
    actions["SK_PlayerDefault.ao|A_Player_WalkToStopRight"];
  const strafeLeftAction =
    actions["SK_PlayerDefault.ao|A_Player_WalkToStopLeft"];
  const jumpAction = actions["SK_PlayerDefault.ao|A_Player_Jump"];
  // ----------------------------------

  const jumpProgress = useRef(0);
  const isJumping = useRef(false);
  const jumpDuration = 0.8; // total jump duration in seconds
  const jumpHeight = 2;

  useEffect(() => {
    if (!scene) return;

    if (idleAction) {
      idleAction.play();
      currentActionRef.current = idleAction;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        if (jumpAction && !isJumping.current) {
          isJumping.current = true;
          jumpProgress.current = 0;
          if (currentActionRef.current) {
            currentActionRef.current.fadeOut(0.1);
          }
          jumpAction.reset().setLoop(THREE.LoopOnce, 1);
          jumpAction.clampWhenFinished = true;
          jumpAction.fadeIn(0.1).play();
          currentActionRef.current = jumpAction;
        }
      }

      if (event.key === "w") movement.current.forward = 1;
      if (event.key === "s") movement.current.forward = -1;

      if (event.key === "a") movement.current.strafe = -1;
      if (event.key === "d") movement.current.strafe = 1;

      if (!isJumping.current) {
        if (
          movement.current.forward !== 0 &&
          actions["SK_PlayerDefault.ao|A_Player_Run"]
        ) {
          if (currentActionRef.current !== runAction) {
            if (currentActionRef.current) {
              currentActionRef.current.fadeOut(0.2);
            }
            runAction?.reset().fadeIn(0.2).play();
            currentActionRef.current = runAction;
          }
        } else if (
          movement.current.forward === 0 &&
          movement.current.strafe !== 0
        ) {
          if (
            movement.current.strafe < 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopLeft"]
          ) {
            if (currentActionRef.current !== strafeLeftAction) {
              if (currentActionRef.current)
                currentActionRef.current.fadeOut(0.2);
              strafeLeftAction?.reset().fadeIn(0.2).play();
              currentActionRef.current = strafeLeftAction;
            }
          } else if (
            movement.current.strafe > 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopRight"]
          ) {
            if (currentActionRef.current !== strafeRightAction) {
              if (currentActionRef.current)
                currentActionRef.current.fadeOut(0.2);
              strafeRightAction?.reset().fadeIn(0.2).play();
              currentActionRef.current = strafeRightAction;
            }
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "w" || event.key === "s") {
        movement.current.forward = 0;
      }
      if (event.key === "a" || event.key === "d") {
        movement.current.strafe = 0;
      }

      if (!isJumping.current) {
        if (movement.current.forward === 0 && movement.current.strafe === 0) {
          if (idleAction && currentActionRef.current !== idleAction) {
            if (currentActionRef.current) currentActionRef.current.fadeOut(0.2);
            idleAction.reset().fadeIn(0.2).play();
            currentActionRef.current = idleAction;
          }
        } else if (
          movement.current.forward !== 0 &&
          actions["SK_PlayerDefault.ao|A_Player_Run"]
        ) {
          if (currentActionRef.current !== runAction) {
            if (currentActionRef.current) currentActionRef.current.fadeOut(0.2);
            runAction?.reset().fadeIn(0.2).play();
            currentActionRef.current = runAction;
          }
        } else if (
          movement.current.forward === 0 &&
          movement.current.strafe !== 0
        ) {
          if (
            movement.current.strafe < 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopLeft"]
          ) {
            if (currentActionRef.current !== strafeLeftAction) {
              if (currentActionRef.current)
                currentActionRef.current.fadeOut(0.2);
              strafeLeftAction?.reset().fadeIn(0.2).play();
              currentActionRef.current = strafeLeftAction;
            }
          } else if (
            movement.current.strafe > 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopRight"]
          ) {
            if (currentActionRef.current !== strafeRightAction) {
              if (currentActionRef.current)
                currentActionRef.current.fadeOut(0.2);
              strafeRightAction?.reset().fadeIn(0.2).play();
              currentActionRef.current = strafeRightAction;
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scene, actions]);

  useFrame((_, delta) => {
    if (!scene) return;
    // Update forward/backward movement (z-axis)
    scene.position.z += movement.current.forward * delta;
    // Update left/right strafing (x-axis)
    scene.position.x += movement.current.strafe * delta;

    // Handle jumping with parabolic motion on y-axis
    if (isJumping.current) {
      jumpProgress.current += delta;
      const progress = Math.min(jumpProgress.current / jumpDuration, 1);
      // Parabolic formula: max height reached at progress=0.5
      scene.position.y = jumpHeight * 4 * progress * (1 - progress);
      if (jumpProgress.current >= jumpDuration) {
        isJumping.current = false;
        jumpProgress.current = 0;
        scene.position.y = 0;
        // After jump, update animation based on current movement
        if (
          movement.current.forward !== 0 &&
          actions["SK_PlayerDefault.ao|A_Player_Run"]
        ) {
          runAction?.reset().fadeIn(0.2).play();
          currentActionRef.current = runAction;
        } else if (
          movement.current.forward === 0 &&
          movement.current.strafe !== 0
        ) {
          if (
            movement.current.strafe < 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopLeft"]
          ) {
            strafeLeftAction?.reset().fadeIn(0.2).play();
            currentActionRef.current = strafeLeftAction;
          } else if (
            movement.current.strafe > 0 &&
            actions["SK_PlayerDefault.ao|A_Player_WalkToStopRight"]
          ) {
            strafeRightAction?.reset().fadeIn(0.2).play();
            currentActionRef.current = strafeRightAction;
          }
        } else {
          if (idleAction) {
            idleAction.reset().fadeIn(0.2).play();
            currentActionRef.current = idleAction;
          }
        }
      }
    }
  });

  return <primitive object={scene} />;
};

export default Player;
