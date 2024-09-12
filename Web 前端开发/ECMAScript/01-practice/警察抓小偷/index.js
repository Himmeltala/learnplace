function replacePx(style) {
  return parseInt(style.replace("px", ""));
}

class Game {
  get _config() {
    return this.config;
  }

  set _config(config) {
    this.config = config;
  }

  get _success() {
    return this.success;
  }

  set _success(success) {
    this.success = success;
  }

  get _error() {
    return this.error;
  }

  set _error(error) {
    this.error = error;
  }

  fillViableCube(container, cubeHW, grid) {
    const baseCubeList = Array.from(container.getElementsByClassName("cube"));
    const viableCubeList = [];
    for (let def of grid) {
      const { count, leftStart, topStart } = def;

      for (let i = 0; i < baseCubeList.length; i++) {
        const cube = baseCubeList[i];
        const left = replacePx(cube.style.left);
        const top = replacePx(cube.style.top);

        if (top === topStart && left >= leftStart && left < (leftStart + count * cubeHW)) {
          cube.classList.remove("base");
          cube.classList.add("viable");
          viableCubeList.push(cube);
        }
      }
    }
    return viableCubeList;
  }

  findViableCube(container, viableLeft, viableTop) {
    const baseCubeList = Array.from(container.getElementsByClassName("viable"));

    for (let i = 0; i < baseCubeList.length; i++) {
      const cube = baseCubeList[i];
      const cubeLeft = replacePx(cube.style.left);
      const cubeTop = replacePx(cube.style.top);

      if (cubeLeft === viableLeft && cubeTop === viableTop && cube.classList.contains("viable")) {
        return cube;
      }
    }

    return null;
  }

  fillCube(container, width = 500, height = 500, cubeHW = 50) {
    for (let i = 0; i < height / cubeHW; i++) {
      for (let j = 0; j < width / cubeHW; j++) {
        const cube = document.createElement("div");
        cube.className = "cube base";
        cube.style.width = `${cubeHW}px`;
        cube.style.height = `${cubeHW}px`;
        cube.style.left = `${j * cubeHW}px`;
        cube.style.top = `${i * cubeHW}px`;
        container.appendChild(cube);
      }
    }
  }

  getNearbyCube(thief, checkClasses, isEdge = false) {
    const allCube = Array.from(document.getElementsByClassName("cube"));
    const thiefTop = thief.style.top;
    const thiefLeft = thief.style.left;
    const cubeWidth = parseInt(thief.style.width);
    const cubeHeight = parseInt(thief.style.height);

    const nearbyCube = [];

    for (let i = 0; i < allCube.length; i++) {
      const cube = allCube[i];
      const cubeTop = cube.style.top;
      const cubeLeft = cube.style.left;
      if (
        (Math.abs(parseInt(cubeLeft) - parseInt(thiefLeft)) === cubeWidth &&
          parseInt(cubeTop) === parseInt(thiefTop)) ||
        (Math.abs(parseInt(cubeTop) - parseInt(thiefTop)) === cubeHeight &&
          parseInt(cubeLeft) === parseInt(thiefLeft))
      ) {
        if (!isEdge) {
          if (!checkClasses.some(cls => cube.classList.contains(cls))) {
            nearbyCube.push(cube);
          }
        } else {
          if (checkClasses.some(cls => cube.classList.contains(cls))) {
            nearbyCube.push(cube);
          }
        }
      }
    }

    return nearbyCube;
  }

  openModal(type, msg) {
    const terminalModal = document.getElementById("terminal-modal");
    terminalModal.style.zIndex = "100";

    if (type === "success") {
      ElementPlus.ElMessage.success(msg);
    } else {
      ElementPlus.ElMessage.error(msg);
    }
  }

  closeModal() {
    const terminalModal = document.getElementById("terminal-modal");
    terminalModal.style.zIndex = "-100";
  }

  occurrence(viableCubeList, success, error) {
    const _this = this;

    viableCubeList.forEach(cube => {
      cube.addEventListener("click", function() {
        if (cube.classList.contains("police") || cube.classList.contains("thief")) {
          ElementPlus.ElMessage.error("不能重复点击警察或小偷！");
          return;
        }

        cube.classList.add("police");
        const thiefCube = document.getElementsByClassName("thief")[0];
        const nearbyCubes = _this.getNearbyCube(thiefCube, ["police", "base"]);

        if (nearbyCubes.length > 0) {
          thiefCube.classList.add("viable");
          thiefCube.classList.remove("thief");
          const newThiefCube = nearbyCubes[Math.floor(Math.random() * nearbyCubes.length)];

          if (_this.getNearbyCube(newThiefCube, ["base"], true).length > 0) {
            _this.openModal("error", "游戏结束！");
            error();
          }

          newThiefCube.classList.add("thief");
        } else {
          _this.openModal("success", "游戏通过！");
          success();
        }
      });
    });
  }

  initialize() {
    document.getElementById("container")?.remove();
    const container = document.createElement("div");
    container.id = "container";
    container.style.width = `${this.config.initial.width}px`;
    container.style.height = `${this.config.initial.height}px`;

    const game = document.getElementById("game");
    game.style.width = `${this.config.initial.width}px`;
    game.style.height = `${this.config.initial.height}px`;
    game.appendChild(container);

    this.fillCube(container, this.config.initial.width, this.config.initial.height, this.config.initial.cubeHW);

    const viableCubeList = this.fillViableCube(container, this.config.initial.cubeHW, this.config.grid);
    const thiefCube = this.findViableCube(container, this.config.initial.thief.left, this.config.initial.thief.top);
    thiefCube.classList.remove("viable");
    thiefCube.classList.add("thief");

    this.occurrence(viableCubeList, this.success, this.error);
  }

}