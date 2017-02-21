(function(lynx) {

    lynx.DialogCtrl = function() {
        this.dialogDom = document.getElementById('dialog');
        this.clear();
    };

    var dialogProto = lynx.DialogCtrl.prototype;

    dialogProto.setConversation = function(npcName, conversation) {
        this.talking = true;
        this.npcName = npcName;
        this.msgIndex = 0;
        this.conversation = conversation;
    };

    dialogProto.talk = function() {
        if (!this.talking) return;
        // if (!this.conversation.length) {
        if (this.msgIndex >= this.conversation.length) {
            this.clear();
            return;
        }
        this.dialogDom.classList.remove('hidden');
        this.dialogDom.classList.add('visible');
        this.dialogDom.class = 'info';
        this.dialogDom.innerHTML = createHTML(this.npcName, this.conversation[this.msgIndex++]);

        function createHTML(name, msg) {
            var html = '<span id="name">' + name + '</span>' +
            '<img src="/img/cube6.png" alt="">' +
            '<div id="msg">' + msg + '</div>';
            return html;
        }
    };

    dialogProto.clear = function() {
        this.talking = false;
        this.npcName = null;
        this.conversation = null;
        this.msgIndex = -1;
        this.dialogDom.classList.add('hidden');
        this.dialogDom.classList.remove('visible');
    };

    lynx.ToolsCtrl = function() {
        this.toolsDom = document.getElementById('tools');
        this.taskDom = document.getElementById('taskList');
        this.goodDom = document.getElementById('goodList');
        this.helpDom = document.getElementById('helpList');
        this.taskShow = false;
        this.goodShow = false;
        this.helpShow = false;

        var toolsclick = lynx.bind(this, this.toolsHandler);
        this.toolsDom.addEventListener('click', toolsclick);

        var taskclick = lynx.bind(this, this.taskHandler);
        // this.taskDom.addEventListener('click', taskclick);

        var goodclick = lynx.bind(this, this.goodHandler);
        this.goodDom.addEventListener('click', goodclick);

    };

    var toolProto = lynx.ToolsCtrl.prototype;

    toolProto.goodHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var goodElem = getGoodElem(event.target);

        if (!goodElem) return;

        useGood.apply(this, [goodElem, goodElem.getAttribute('goodNum')]);

        // if (goodElem.classList.contains('selected')) {
        //     goodElem.classList.remove('selected');
        //     goodElem.style.marginBottom = '0';
        // } else {
        //     deselectAll(this.goodDom);
        //     goodElem.classList.add('selected');
        //     changeMargin(goodElem);
        // }

        function useGood(elem, goodNum) {
            var good = this.getPlayer().goods[goodNum];
            if (!good) return;

            if (good.count > 0) {
                good.count--;
                elem.outerHTML = this.createGood(good, goodNum);
                return true;
            }
        }

        function changeMargin(elem) {
            if (!elem.childNodes) return;

            var children = elem.childNodes;

            for (var i = 0, iLen = children.length; i < iLen; i++) {
                var node = children[i];
                if (node.nodeType === 1 && node.classList.contains('description')) {
                    elem.style.marginBottom = node.offsetHeight + 'px';
                    return;
                }
            }
        }

        function getGoodElem(elem) {
            var node = elem;
            while (node.id !== 'goodList' && node !== document) {
                if (node.classList.contains('good')) {
                    return node;
                }
                node = node.parentNode;
            }
        }

        function deselectAll(list) {
            if (!list.childNodes) return;

            var children = list.childNodes;

            for (var i = 0, iLen = children.length; i < iLen; i++) {
                var node = children[i];
                if (node.nodeType === 1 && node.classList.contains('good')) {
                    node.classList.remove('selected');
                    node.style.marginBottom = '0';
                }
            }
        }
    };

    toolProto.taskHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var taskElem = getMission(event.target);
        if (taskElem) {
            taskElem.classList.toggle('selected');
        }

        function getMission(elem) {
            var node = elem;
            while (node.id !== 'taskList' && node !== document) {
                if (node.classList.contains('mission')) {
                    return node;
                }
                node = node.parentNode;
            }
        }
    };

    toolProto.toolsHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (event.target.id === 'task' || event.target.parentNode.id === 'task') {
            this.toggleTasks();
        }
        if (event.target.id === 'good' || event.target.parentNode.id === 'good') {
            this.toggleGoods();
        }
        if (event.target.id === 'help' || event.target.parentNode.id === 'help') {
            this.toggleHelp();
        }
    };

    toolProto.toggleTasks = function() {

        if (this.taskShow) {
            this.taskDom.classList.add('hidden');
            this.taskDom.classList.remove('visible');
            this.taskShow = false;
            return;
        }

        var tasks = this.getPlayer().tasks;

        var tasksHTML = '';
        for (var i = 0, iLen = tasks.length; i < iLen; i++) {
            var taskHTML = createTask(tasks[i]);
            tasksHTML += taskHTML;
        }

        this.taskDom.classList.add('visible');
        this.taskDom.classList.remove('hidden');
        this.taskDom.innerHTML = tasksHTML;
        this.taskShow = true;

        function createTask(task) {
            var stateClass = task.state === lynx.taskState.COMPLET ? 'icon-check_circle' : 'icon-radio_button_unchecked';
            var description = task.messages[lynx.taskState.CREATE].join('\n');
            var taskHTML = '<div class="mission">' + '<div class="title">' +
                '<span class="' + stateClass + '"></span>' +
                '<span>Welcome</span>' + '</div>' +
                '<div class="description">' + description + '</div>' + '</div>';
            return taskHTML;
        }
    };

    toolProto.toggleGoods = function() {

        if (this.goodShow) {
            this.goodDom.classList.add('hidden');
            this.goodDom.classList.remove('visible');
            this.goodShow = false;
            return;
        }

        var goods = this.getPlayer().goods;

        var goodsHTML = '';
        for (var i = 0, iLen = goods.length; i < iLen; i++) {
            var goodHTML = this.createGood(goods[i], i);
            goodsHTML += goodHTML;
        }

        this.goodDom.classList.add('visible');
        this.goodDom.classList.remove('hidden');
        this.goodDom.innerHTML = goodsHTML;
        this.goodShow = true;

    };

    toolProto.createGood = function (good, goodNum) {
        var goodHTML = '<div class="good" goodnum="' + goodNum + '">' +
            '<div class="title">' +
            '<span class="icon icon-help"></span>' +
            '<span class="count">' + good.count + '</span>' +
            '<span class="name">' + good.name + '</span>' +
            '</div>' +
            '<div class="description">' + good.description + '</div>' +
            '</div>';
        return goodHTML;
    };

    toolProto.toggleHelp = function() {

        if (this.helpShow) {
            this.helpDom.classList.add('hidden');
            this.helpDom.classList.remove('visible');
            this.helpShow = false;
            return;
        }

        // var configs = this.getPlayer().configs;
        //
        // var configsHTML = '';
        // for (var i = 0, iLen = configs.length; i < iLen; i++) {
        //     var configHTML = createTask(configs[i]);
        //     configsHTML += configHTML;
        // }
        //
        this.helpDom.classList.add('visible');
        this.helpDom.classList.remove('hidden');
        // this.configDom.innerHTML = configsHTML;
        this.helpShow = true;
        //
        // function createTask(config) {
        //     var stateClass = config.state === lynx.configState.COMPLET ? 'icon-check_circle' : 'icon-radio_button_unchecked';
        //     var description = config.messages[lynx.configState.CREATE].join('\n');
        //     var configHTML = '<div class="mission">' + '<div class="title">' +
        //         '<span class="' + stateClass + '"></span>' +
        //         '<span>Welcome</span>' + '</div>' +
        //         '<div class="description">' + description + '</div>' + '</div>';
        //     return configHTML;
        // }
    };

    lynx.HeadUpDisplay = function() {
        this.healthDom = document.getElementById('health');
        this.moneyDom = document.getElementById('money');
        this.promtDom = document.getElementById('pause');
        this.loadingDom = document.getElementById('welcome');
        this.identityDom = document.getElementById('identity');

        this.dialogCtrl = new lynx.DialogCtrl();

        this.toolsCtrl = new lynx.ToolsCtrl();
        var getPlayer = lynx.bind(this, this.getPlayer);
        this.toolsCtrl.getPlayer = getPlayer;

        // this.musicDom = document.getElementById('music');
        // this.musicDom.loop = true;

    };

    var hudProto = lynx.HeadUpDisplay.prototype;

    hudProto.isTalking = function() {
        return this.dialogCtrl.talking;
    };

    hudProto.setConversation = function(npcName, conversation) {
        this.dialogCtrl.setConversation(npcName, conversation);
        this.talk();
    };

    hudProto.talk = function() {
        this.dialogCtrl.talk();
        return this.dialogCtrl.talking;
    };

    hudProto.loading = function() {
        if (!this.loadingDom) return;
        this.loadingDom.classList.remove('hidden');
        this.loadingDom.classList.add('visible');
    };

    hudProto.loadComplete = function() {
        if (!this.loadingDom) return;

        var waitDom = document.getElementById('load-wait');
        waitDom.classList.remove('visible');
        waitDom.classList.add('hidden');
        var endDom = document.getElementById('load-end');
        endDom.classList.remove('hidden');
    };

    hudProto.hideLoading = function() {
        if (!this.loadingDom) return;
        this.loadingDom.classList.remove('visible');
        this.loadingDom.classList.add('hidden');
    };

    hudProto.promt = function(type, msg) {
        if (!this.promtDom) return;
        // this.promtDom.classList.add('visible');
        this.promtDom.classList.remove('hidden');
        this.promtDom.classList.add('visible', type);
        // this.promtDom.innerHTML = msg;
    };

    hudProto.hidePromt = function() {
        if (!this.promtDom) return;
        // this.promtDom.classList.add('hidden');
        this.promtDom.classList.remove('visible');
        this.promtDom.classList.add('hidden');

    };

    hudProto.identity = function(name, top, left) {
        if (!this.identityDom) return;
        this.identityDom.innerHTML = '<img src="/img/merchant_cat.jpg" alt="merchant_cat"><span>' + name + '</span>';
        this.identityDom.classList.add('visible');
        this.identityDom.style.top = top + 'px';
        this.identityDom.style.left = left + 'px';
    };

    hudProto.hideIdentity = function() {
        if (!this.identityDom) return;
        this.identityDom.classList.add('hidden');
    };

    hudProto.health = function(health) {
        if (!this.healthDom) return;
        // control by world
        if (!health) {
            this.promt('danger', 'Game Over');
        }
        this.healthDom.innerHTML = health;
    };

    hudProto.money = function(money) {
        if (!this.moneyDom) return;
        this.moneyDom.innerHTML = money;
    };

    hudProto.setPlayer = function(player) {
        this.player = player;
        this.playerState(player.health, player.money);
    };

    hudProto.getPlayer = function() {
        return this.player;
    };

    hudProto.playerState = function(health, money) {
        this.health(health);
        this.money(money);
    };

    hudProto.playMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.play();
    };

    hudProto.closeMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.pause();
    };

})(lynx);
