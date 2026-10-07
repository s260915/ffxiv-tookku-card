document.addEventListener("DOMContentLoaded", function () {
	
	document.fonts.load('400 20px "BookkMyungjo"');
	document.fonts.load('400 20px "Daegu-Dongseong-ro"');
	document.fonts.load('400 20px "leeseoyoon"');
	
	const ITEM_CSV_URL = "./data/Item_equipment.csv";
	let itemData = [];
	
    const backgroundImageInput = document.querySelector("#backgroundImageInput");
    const backgroundImage = document.querySelector("#backgroundImage");
    const emptyImageArea = document.querySelector("#emptyImageArea");
    const imageWorkspace = document.querySelector("#imageWorkspace");
    const stageScaler = document.querySelector("#stageScaler");
    const stage = document.querySelector("#stage");
    const cardLayer = document.querySelector("#cardLayer");
    const itemSearchKeyword = document.querySelector("#itemSearchKeyword");
    const itemSearchBtn = document.querySelector("#itemSearchBtn");
    const itemSearchResult = document.querySelector("#itemSearchResult");
    const cardList = document.querySelector("#cardList");
    const cardCount = document.querySelector("#cardCount");
    const addBlankCardBtn = document.querySelector("#addBlankCardBtn");
    const emptySetting = document.querySelector("#emptySetting");
    const cardSettingArea = document.querySelector("#cardSettingArea");
    const selectedCardTitle = document.querySelector("#selectedCardTitle");
    const toggleCardVisibleBtn = document.querySelector("#toggleCardVisibleBtn");
    const deleteCardBtn = document.querySelector("#deleteCardBtn");
    const zoomRange = document.querySelector("#zoomRange");
    const zoomNumber = document.querySelector("#zoomNumber");
    const zoomOutBtn = document.querySelector("#zoomOutBtn");
    const zoomInBtn = document.querySelector("#zoomInBtn");
    const fitImageBtn = document.querySelector("#fitImageBtn");
    const zoom100Btn = document.querySelector("#zoom100Btn");
    const downloadImageBtn = document.querySelector("#downloadImageBtn");
	const rotateImageLeftBtn = document.querySelector("#rotateImageLeftBtn");
	const rotateImageRightBtn = document.querySelector("#rotateImageRightBtn");
	const textOpacity = document.querySelector("#textOpacity");
	const textOpacityNumber = document.querySelector("#textOpacityNumber");
	
    let cards = [];
    let searchItems = [];
    let selectedCardId = null;
    let imageWidth = 0;
    let imageHeight = 0;
    let zoom = 1;
    let sequence = 1;
    let pointerAction = null;
	let panX = 0;
	let panY = 0;
	let isPanning = false;
	let panStartX = 0;
	let panStartY = 0;
	
	const dyeList = [
		{ name:"없음", color:"#ffffff" },
	    { name:"하얀 눈색", color:"#e4dfd0" },
	    { name:"회색", color:"#aca8a2" },
	    { name:"구부 회색", color:"#898784" },
	    { name:"진회색", color:"#656565" },
	    { name:"탄회색", color:"#484742" },
	    { name:"숯검정색", color:"#2b2923" },
	    { name:"장미색", color:"#e69f96" },
	    { name:"라일락색", color:"#836969" },
	    { name:"롤란베리색", color:"#5b1729" },
	    { name:"달라가브색", color:"#781a1a" },
	    { name:"녹슨 빨간색", color:"#622207" },
	    { name:"포도주색", color:"#451511" },
	    { name:"산호색", color:"#cc6c5e" },
	    { name:"선홍색", color:"#913b27" },
	    { name:"연어색", color:"#e4aa8a" },
	    { name:"홍옥색", color:"#e40011" },
	    { name:"꽃분홍색", color:"#f5379b" },
	    { name:"연지색", color:"#de0b16" },
	    { name:"형광 분홍색", color:"#ed118e" },
	    { name:"노을색", color:"#b75c2d" },
	    { name:"황야의 붉은색", color:"#7d3906" },
	    { name:"나무껍질색", color:"#6a4b37" },
	    { name:"초콜릿색", color:"#6e3d24" },
	    { name:"적갈색", color:"#4f2d1f" },
	    { name:"코볼드색", color:"#30211b" },
	    { name:"코르크색", color:"#c99156" },
	    { name:"키키룬색", color:"#996e3f" },
	    { name:"오포오포색", color:"#7b5c2d" },
	    { name:"큰뿔염소색", color:"#a2875c" },
	    { name:"늙은호박색", color:"#c57424" },
	    { name:"도토리색", color:"#8e581b" },
	    { name:"과수원 흙색", color:"#644216" },
	    { name:"밤색", color:"#3d290d" },
	    { name:"고블린색", color:"#b9a489" },
	    { name:"찰흙색", color:"#92816c" },
	    { name:"두더지색", color:"#615245" },
	    { name:"비옥토색", color:"#3f3329" },
	    { name:"밝은 주황색", color:"#f45011" },
	    { name:"상아색", color:"#ead29f" },
	    { name:"울다하 갈색", color:"#b7a370" },
	    { name:"사막노란색", color:"#dbb457" },
	    { name:"꿀색", color:"#fac62b" },
	    { name:"옥수수색", color:"#e49e34" },
	    { name:"커얼색", color:"#bc8804" },
	    { name:"크림색", color:"#f2d770" },
	    { name:"할라탈리 노란색", color:"#a58430" },
	    { name:"건포도색", color:"#403311" },
	    { name:"카나리아색", color:"#fef864" },
	    { name:"바닐라색", color:"#fbf1b4" },
	    { name:"형광 노란색", color:"#dfea08" },
	    { name:"습지 녹색", color:"#585230" },
	    { name:"실프색", color:"#bbbb8a" },
	    { name:"라임색", color:"#abb054" },
	    { name:"이끼색", color:"#707326" },
	    { name:"풀색", color:"#8b9c63" },
	    { name:"올리브색", color:"#4b5232" },
	    { name:"늪지 녹색", color:"#323621" },
	    { name:"풋사과색", color:"#9bb363" },
	    { name:"선인장색", color:"#658241" },
	    { name:"진녹색", color:"#284b2c" },
	    { name:"오츄색", color:"#406339" },
	    { name:"금강거북색", color:"#5f7558" },
	    { name:"노피카의 녹색", color:"#3b4d3c" },
	    { name:"밀림 녹색", color:"#1e2a21" },
	    { name:"옅은 청록색", color:"#96bdb9" },
	    { name:"터키석색", color:"#437272" },
	    { name:"몰볼색", color:"#1f4646" },
	    { name:"형광 녹색", color:"#b5f710" },
	    { name:"옅은 하늘색", color:"#b2c4ce" },
	    { name:"하늘색", color:"#83b0d2" },
	    { name:"바다안개색", color:"#6481a0" },
	    { name:"공작깃 파란색", color:"#3b6886" },
	    { name:"로타노 바다색", color:"#1c3d54" },
	    { name:"좀비의 얼굴색", color:"#8e9bac" },
	    { name:"청린수색", color:"#4f5766" },
	    { name:"쪽빛 파란색", color:"#2f3851" },
	    { name:"검푸른색", color:"#1a1f27" },
	    { name:"랍토르색", color:"#5b7fc0" },
	    { name:"오사드 바다색", color:"#2f5889" },
	    { name:"선명한 파란색", color:"#234172" },
	    { name:"보이드의 파란색", color:"#112842" },
	    { name:"감청색", color:"#273067" },
	    { name:"밤하늘색", color:"#181937" },
	    { name:"청회색", color:"#373747" },
	    { name:"청보라색", color:"#312d57" },
	    { name:"새파란색", color:"#000ea2" },
	    { name:"담청색", color:"#04afcd" },
	    { name:"짙은 하늘색", color:"#3a4c90" },
	    { name:"라벤더색", color:"#877fae" },
	    { name:"어두운 보라색", color:"#514560" },
	    { name:"머루색", color:"#322c3b" },
	    { name:"붓꽃색", color:"#b79ebc" },
	    { name:"포도색", color:"#3b2a3d" },
	    { name:"연꽃색", color:"#fecef5" },
	    { name:"콜리브리색", color:"#dc9bca" },
	    { name:"매화색", color:"#79526c" },
	    { name:"자주색", color:"#66304e" },
	    { name:"제비꽃색", color:"#62508f" },
	    { name:"순백색", color:"#f9f8f4" },
	    { name:"칠흑색", color:"#1e1e1e" },
	    { name:"부드러운 연분홍", color:"#fdc8c6" },
	    { name:"짙은 빨강", color:"#321919" },
	    { name:"짙은 갈색", color:"#28211c" },
	    { name:"부드러운 연녹색", color:"#bacfaa" },
	    { name:"짙은 녹색", color:"#152c2c" },
	    { name:"부드러운 연파랑", color:"#96a4d9" },
	    { name:"짙은 파랑", color:"#121f2d" },
	    { name:"부드러운 연보라", color:"#bbb5da" },
	    { name:"짙은 자주색", color:"#232026" },
	    { name:"반짝이는 은색", color:"#8a8a8a" },
	    { name:"반짝이는 금색", color:"#ffff3d" },
	    { name:"금속질 빨간색", color:"#f01d4b" },
	    { name:"금속질 주황색", color:"#ff7c1f" },
	    { name:"금속질 노란색", color:"#ffff46" },
	    { name:"금속질 녹색", color:"#22d657" },
	    { name:"금속질 하늘색", color:"#5cffff" },
	    { name:"금속질 파란색", color:"#2729c3" },
	    { name:"금속질 보라색", color:"#bc66f2" },
	    { name:"건메탈색", color:"#36363e" },
	    { name:"진주색", color:"#ffffff" },
	    { name:"황동색", color:"#fff690" },
	    { name:"금속질 분홍색", color:"#da5a7a" },
	    { name:"금속질 홍옥색", color:"#1f0000" },
	    { name:"금속질 푸른 녹색", color:"#15423f" },
	    { name:"금속질 짙은 파랑", color:"#08021f" }
	];
	initDyeSelect(1);
	initDyeSelect(2);
	
	textOpacity.addEventListener("input", function () {
	    textOpacityNumber.value = textOpacity.value;
	    updateSelectedCardFromSettings();
	});

	textOpacityNumber.addEventListener("input", function () {
	    const value = clamp(Number(textOpacityNumber.value), 0, 100);
	    textOpacity.value = value;
	    updateSelectedCardFromSettings();
	});
	
	rotateImageLeftBtn.addEventListener("click", function () {
	    rotateBackgroundImage(-90);
	});

	rotateImageRightBtn.addEventListener("click", function () {
	    rotateBackgroundImage(90);
	});
	
	backgroundImageInput.addEventListener("change", function (event) {
	    const file = event.target.files[0];
	    if (!file) return;

	    loadBackgroundImage(file);
	});
	
    itemSearchBtn.addEventListener("click", searchItem);
	
    itemSearchKeyword.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchItem();
        }
    });
	
	addBlankCardBtn.addEventListener("click", function () {
	    const card = createDefaultCard();
	    card.textColor = "#000000";
	    card.textOpacity = 100;
	    card.backgroundOpacity = 0;
	    card.borderWidth = 0;
	    card.borderRadius = 0;
	    addCard(card);
	});
	
    toggleCardVisibleBtn.addEventListener("click", toggleSelectedCard);
	
    deleteCardBtn.addEventListener("click", deleteSelectedCard);
	
    zoomRange.addEventListener("input", function () {
        setZoom(Number(this.value));
    });
	
    zoomNumber.addEventListener("change", function () {
        setZoom(Number(this.value));
    });
	
    zoomOutBtn.addEventListener("click", function () {
        setZoom(Math.round(zoom * 100) - 10);
    });
	
    zoomInBtn.addEventListener("click", function () {
        setZoom(Math.round(zoom * 100) + 10);
    });
	
    fitImageBtn.addEventListener("click", fitImageToScreen);
	
    zoom100Btn.addEventListener("click", function () {
        setZoom(100);
    });
	
    downloadImageBtn.addEventListener("click", downloadImage);
	
	document.addEventListener("click", function () {
	    document.querySelectorAll(".dye-dropdown").forEach(function (item) {
	        item.classList.remove("open");
	    });
	});
	
	const applyStyleAllBtn = document.querySelector("#applyStyleAllBtn");
	applyStyleAllBtn.addEventListener("click", applySelectedStyleToAll);
	
	async function loadItemData() {
	    if (itemData.length > 0) {
	        return;
	    }

	    const response = await fetch(ITEM_CSV_URL);

	    if (!response.ok) {
	        throw new Error("아이템 CSV를 불러오지 못했습니다.");
	    }

	    const csvText = await response.text();
	    const lines = csvText.trim().split(/\r?\n/);

	    itemData = lines.slice(1).map(function (line) {
	        const columns = line.split(",");

	        return {
	            itemId: Number(columns[0]),
	            nameKo: columns[1],
	            dyeCount: Number(columns[2] || 0)
	        };
	    });

	    console.log("아이템 데이터 로딩 완료:", itemData.length);
	}
	
	function searchLocalItems(keyword) {
	    const searchKeyword = keyword.trim().toLowerCase();

	    return itemData
	        .filter(function (item) {
	            return item.nameKo.toLowerCase().includes(searchKeyword);
	        })
	        .sort(function (a, b) {
	            const aStarts = a.nameKo.toLowerCase().startsWith(searchKeyword);
	            const bStarts = b.nameKo.toLowerCase().startsWith(searchKeyword);

	            if (aStarts !== bStarts) {
	                return aStarts ? -1 : 1;
	            }

	            return a.nameKo.localeCompare(b.nameKo, "ko");
	        })
	        .slice(0, 30);
	}
	
	async function getGlobalItemInfo(itemList) {
	    if (itemList.length === 0) {
	        return [];
	    }

	    const itemIds = itemList.map(function (item) {
	        return item.itemId;
	    }).join(",");

	    const params = new URLSearchParams();

	    params.append("rows", itemIds);
	    params.append("fields", "Name,Name@lang(ja),Icon");

	    const response = await fetch(
	        "https://v2.xivapi.com/api/sheet/Item?" + params.toString()
	    );

	    if (!response.ok) {
	        throw new Error("XIVAPI HTTP " + response.status);
	    }

	    const data = await response.json();
	    const rows = data.rows || [];

	    const globalItemMap = new Map();

	    rows.forEach(function (row) {
	        const fields = row.fields || {};
	        const icon = fields.Icon || {};
	        const iconPath = icon.path_hr1 || icon.path || "";

	        globalItemMap.set(Number(row.row_id), {
	            nameEn: fields.Name || "",
	            nameJa: fields["Name@lang(ja)"] || "",
	            imageUrl: iconPath
	                ? "https://v2.xivapi.com/api/asset?path=" + encodeURIComponent(iconPath) + "&format=png"
	                : ""
	        });
	    });

	    return itemList.map(function (item) {
	        const globalItem = globalItemMap.get(Number(item.itemId)) || {};

	        return {
	            itemId: item.itemId,
	            nameKo: item.nameKo,
	            nameJa: globalItem.nameJa || "",
	            nameEn: globalItem.nameEn || "",
	            dyeCount: item.dyeCount,
	            imageUrl: globalItem.imageUrl || ""
	        };
	    });
	}
	
	async function searchItem() {
	    const keyword = itemSearchKeyword.value.trim();

	    if (!keyword) {
	        itemSearchResult.innerHTML = '<div class="empty-message">검색할 아이템명을 입력해주세요.</div>';
	        return;
	    }

	    itemSearchResult.innerHTML = '<div class="empty-message">아이템을 검색하고 있습니다.</div>';

	    try {
	        await loadItemData();

	        const list = searchLocalItems(keyword);
	        const globalItemList = await getGlobalItemInfo(list);

	        searchItems = globalItemList.map(normalizeSearchItem);

	        renderSearchResult();
	    } catch (error) {
	        console.error("아이템 검색 오류:", error);
	        itemSearchResult.innerHTML = '<div class="empty-message">아이템 검색 중 오류가 발생했습니다.</div>';
	    }
	}
	
    function normalizeSearchItem(item) {
        return {
            itemId: item.itemId ?? "",
            nameKo: item.nameKo || "",
            nameJa: item.nameJa || "",
            nameEn: item.nameEn || "",
            dyeCount: Number(item.dyeCount ?? 0),
            imageUrl: item.imageUrl || ""
        };
    }
    function renderSearchResult() {
        itemSearchResult.innerHTML = "";
        if (searchItems.length === 0) {
            itemSearchResult.innerHTML = '<div class="empty-message">검색된 아이템이 없습니다.</div>';
            return;
        }
        searchItems.forEach(function (item, index) {
            const row = document.createElement("div");
            row.className = "search-result-item";
            row.innerHTML = `
                <div class="search-result-image">
                    ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="">` : ""}
                </div>
                <div class="search-result-info">
                    <div class="search-result-name">
                        ${escapeHtml(item.nameKo || item.nameJa || item.nameEn || "이름 없는 아이템")}
                    </div>
                    <div class="search-result-sub">
                        ${escapeHtml([item.nameJa, item.nameEn].filter(Boolean).join(" / "))}
                    </div>
                    <div class="search-result-sub">
                        염색 슬롯 ${item.dyeCount}개
                    </div>
                </div>
                <button type="button"
                        class="search-result-add"
                        data-index="${index}">
                    추가
                </button>
            `;
            itemSearchResult.appendChild(row);
        });
        itemSearchResult.querySelectorAll(".search-result-add").forEach(function (button) {
            button.addEventListener("click", function () {
                const item = searchItems[Number(this.dataset.index)];
                addCard(createCardFromItem(item));
            });
        });
    }
    function createCardFromItem(item) {
        const card = createDefaultCard();
        card.itemId = item.itemId;
        card.nameKo = item.nameKo;
        card.nameJa = item.nameJa;
        card.nameEn = item.nameEn;
        card.imageUrl = item.imageUrl;
        card.iconId = item.iconId;
        card.equipSlotCategory = item.equipSlotCategory;
        card.dyeCount = item.dyeCount;
        card.showKo = !!item.nameKo;
        card.showJa = !!item.nameJa;
        card.showEn = !!item.nameEn;
        card.showImage = !!item.imageUrl;
        return card;
    }
	
    function createDefaultCard() {
        const width = 420;
        const height = 120;
        const centerX = imageWidth > 0 ? imageWidth / 2 : width / 2 + 20;
        const centerY = imageHeight > 0 ? Math.min(150 + cards.length * 130, imageHeight - height / 2) : height / 2 + 20;
        return {
            id: "item-card-" + Date.now() + "-" + sequence++,
            itemId: "",
            nameKo: "ⓒ SQUARE ENIX",
            nameJa: "",
            nameEn: "",
            imageUrl: "",
            iconId: 0,
            equipSlotCategory: 0,
            dyeCount: 2,
            dye1Name: "",
            dye1Color: "#ffffff",
            dye2Name: "",
            dye2Color: "#ffffff",
            showKo: true,
            showJa: false,
            showEn: false,
            showImage: true,
            showDye1: false,
            showDye2: false,
            visible: true,
            cx: centerX,
            cy: centerY,
            width: width,
            height: height,
            rotation: 0,
            fontFamily: "NotoSansKR",
            fontSize: 22,
            fontWeight: "400",
            lineHeight: 1.25,
            textAlign: "left",
            textColor: "#ffffff",
            itemImageSize: 76,
            backgroundColor: "#181c22",
            backgroundOpacity: 85,
            padding: 14,
            gap: 12,
            borderColor: "#ffffff",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 10
        };
    }
	
    function addCard(card) {
        if (imageWidth <= 0 || imageHeight <= 0) {
            alert("먼저 편집할 이미지를 불러와주세요.");
            return;
        }
        card.cx = clamp(card.cx, card.width / 2, imageWidth - card.width / 2);
        card.cy = clamp(card.cy, card.height / 2, imageHeight - card.height / 2);
        cards.push(card);
        selectedCardId = card.id;
        renderAll();
    }
	
	function loadBackgroundImage(file) {
	    if (!file) return;
	    if (!file.type.startsWith("image/")) {
	        alert("이미지 파일만 등록할 수 있습니다.");
	        return;
	    }

	    const reader = new FileReader();

	    reader.onload = function (readerEvent) {
	        const image = new Image();

	        image.onload = function () {
	            imageWidth = image.naturalWidth;
	            imageHeight = image.naturalHeight;
	            backgroundImage.src = readerEvent.target.result;

	            stage.style.width = imageWidth + "px";
	            stage.style.height = imageHeight + "px";

	            emptyImageArea.style.display = "none";
	            stageScaler.style.display = "block";

	            cards.forEach(function (card) {
	                card.cx = clamp(card.cx, card.width / 2, imageWidth - card.width / 2);
	                card.cy = clamp(card.cy, card.height / 2, imageHeight - card.height / 2);
	            });

	            panX = 0;
	            panY = 0;

	            renderAll();

	            requestAnimationFrame(function () {
	                fitImageToScreen();
	            });
	        };

	        image.src = readerEvent.target.result;
	    };

	    reader.readAsDataURL(file);
	}
	
    function renderAll() {
        renderCards();
        renderCardList();
        renderSettings();
        updateGroupPositionFields();
    }
    function renderCards() {
        cardLayer.innerHTML = "";
        cards.forEach(function (card) {
            const element = document.createElement("div");
            element.className = "item-card";
            if (card.id === selectedCardId) {
                element.classList.add("selected");
            }
            if (!card.visible) {
                element.classList.add("hidden-card");
            }
            element.dataset.cardId = card.id;
            applyCardPosition(element, card);
            const body = document.createElement("div");
            body.className = "item-card-body";
            body.style.padding = card.padding + "px";
            body.style.gap = card.gap + "px";
			body.style.backgroundColor = hexToRgba(card.backgroundColor, card.backgroundOpacity / 100);
			body.style.color = hexToRgba(card.textColor, (card.textOpacity ?? 100) / 100);
			body.style.borderColor = card.borderColor;
            body.style.borderWidth = card.borderWidth + "px";
            body.style.borderStyle = card.borderStyle;
            body.style.borderRadius = card.borderRadius + "px";
            body.style.fontFamily = card.fontFamily;
            body.style.fontSize = card.fontSize + "px";
            body.style.fontWeight = card.fontWeight;
            body.style.lineHeight = card.lineHeight;
            body.style.textAlign = card.textAlign;
            if (card.showImage && card.imageUrl) {
                const imageWrap = document.createElement("div");
                const image = document.createElement("img");
                imageWrap.className = "item-card-image-wrap";
                imageWrap.style.width = card.itemImageSize + "px";
                imageWrap.style.height = card.itemImageSize + "px";
                image.className = "item-card-image";
                image.src = card.imageUrl;
                image.crossOrigin = "anonymous";
                imageWrap.appendChild(image);
                body.appendChild(imageWrap);
            }
            const textWrap = document.createElement("div");
            textWrap.className = "item-card-text";
            if (card.showKo && card.nameKo) {
                textWrap.appendChild(createLanguageElement(card.nameKo, "ko"));
            }
            if (card.showJa && card.nameJa) {
                textWrap.appendChild(createLanguageElement(card.nameJa, "ja"));
            }
            if (card.showEn && card.nameEn) {
                textWrap.appendChild(createLanguageElement(card.nameEn, "en"));
            }
            const dyeWrap = createDyeElements(card);
            if (dyeWrap) {
                textWrap.appendChild(dyeWrap);
            }
            body.appendChild(textWrap);
            element.appendChild(body);
            ["nw", "n", "ne", "e", "se", "s", "sw", "w"].forEach(function (direction) {
                const handle = document.createElement("div");
                handle.className = "resize-handle " + direction;
                handle.dataset.direction = direction;
                handle.addEventListener("pointerdown", startResize);
                element.appendChild(handle);
            });
            const rotateLine = document.createElement("div");
            const rotateHandle = document.createElement("div");
            rotateLine.className = "rotate-line";
            rotateHandle.className = "rotate-handle";
            rotateHandle.addEventListener("pointerdown", startRotate);
            element.appendChild(rotateLine);
            element.appendChild(rotateHandle);
            body.addEventListener("pointerdown", startDrag);
            element.addEventListener("click", function (event) {
                event.stopPropagation();
                selectCard(card.id);
            });
            cardLayer.appendChild(element);
        });
    }
    function createLanguageElement(text, lang) {
        const element = document.createElement("div");
        element.className = "item-language";
        element.lang = lang;
        element.textContent = text;
        return element;
    }
    function createDyeElements(card) {
        if ((!card.showDye1 || !card.dye1Name) && (!card.showDye2 || !card.dye2Name)) {
            return null;
        }
        const wrap = document.createElement("div");
        wrap.className = "item-dyes";
        wrap.style.gap = Math.max(4, card.gap / 2) + "px";
		wrap.style.justifyContent = card.textAlign === "center"
		? "center"
		: card.textAlign === "right"
		    ? "flex-end"
		    : "flex-start";
        if (card.showDye1 && card.dye1Name) {
            wrap.appendChild(createDyeElement(card.dye1Name, card.dye1Color, card.fontSize));
        }
        if (card.showDye2 && card.dye2Name) {
            wrap.appendChild(createDyeElement(card.dye2Name, card.dye2Color, card.fontSize));
        }
        return wrap;
    }
	function createDyeElement(name, color, fontSize) {
	    const dye = document.createElement("div");
	    const colorElement = document.createElement("span");
	    const nameElement = document.createElement("span");
	    const dyeFontSize = Math.max(9, fontSize * 0.72);

	    dye.className = "item-dye";
	    dye.style.fontSize = dyeFontSize + "px";

	    colorElement.className = "item-dye-color";
	    colorElement.style.width = dyeFontSize + "px";
	    colorElement.style.height = dyeFontSize + "px";
	    colorElement.style.backgroundColor = color;
	    colorElement.style.marginRight = Math.max(4, dyeFontSize * 0.3) + "px";

	    nameElement.className = "item-dye-name";
	    nameElement.textContent = name;

	    dye.appendChild(colorElement);
	    dye.appendChild(nameElement);
	    return dye;
	}
    function applyCardPosition(element, card) {
        element.style.left = card.cx - card.width / 2 + "px";
        element.style.top = card.cy - card.height / 2 + "px";
        element.style.width = card.width + "px";
        element.style.height = card.height + "px";
        element.style.transform = "rotate(" + card.rotation + "deg)";
    }
	
    function renderCardList() {
        cardList.innerHTML = "";
        cardCount.textContent = cards.length;
        if (cards.length === 0) {
            cardList.innerHTML = '<div class="empty-message">생성된 아이템 카드가 없습니다.</div>';
            return;
        }
        cards.forEach(function (card, index) {
            const row = document.createElement("div");
            row.className = "card-list-item";
            if (card.id === selectedCardId) {
                row.classList.add("selected");
            }
            if (!card.visible) {
                row.classList.add("card-hidden");
            }
			row.innerHTML = `
			    <div class="card-list-number">
			        ${index + 1}
			    </div>
			    <div class="card-list-name-wrap">
			        <div class="card-list-name">
			            ${escapeHtml(getCardDisplayName(card))}
			        </div>
			        <div class="card-list-status">
			            ${card.visible ? "표시 중" : "숨김"}
			        </div>
			    </div>
			    <button type="button"
			            class="card-list-action card-list-visible ${card.visible ? "active" : ""}"
			            title="${card.visible ? "숨기기" : "보이기"}">
			        ${card.visible ? `
			            <svg viewBox="0 0 24 24" aria-hidden="true">
			                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/>
			                <circle cx="12" cy="12" r="2.7"/>
			            </svg>
			        ` : `
			            <svg viewBox="0 0 24 24" aria-hidden="true">
			                <path d="M3 3l18 18"/>
			                <path d="M10.6 6.2A9.2 9.2 0 0 1 12 6c6 0 9.5 6 9.5 6a15.7 15.7 0 0 1-2.2 2.8"/>
			                <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 3-.5"/>
			            </svg>
			        `}
			    </button>
			    <button type="button"
			            class="card-list-action card-list-delete"
			            title="삭제">
			        <svg viewBox="0 0 24 24" aria-hidden="true">
			            <path d="M4 7h16"/>
			            <path d="M9 7V4h6v3"/>
			            <path d="M6.5 7l1 13h9l1-13"/>
			            <path d="M10 11v5"/>
			            <path d="M14 11v5"/>
			        </svg>
			    </button>
			`;
            row.addEventListener("click", function () {
                selectCard(card.id);
            });
            row.querySelector(".card-list-visible").addEventListener("click", function (event) {
                event.stopPropagation();
                card.visible = !card.visible;
                renderAll();
            });
			row.querySelector(".card-list-delete").addEventListener("click", function (event) {
			    event.stopPropagation();
			    deleteSelectedCard(card.id);
			});
            cardList.appendChild(row);
        });
    }
	
    function getCardDisplayName(card) {
        return card.nameKo || card.nameJa || card.nameEn || "이름 없는 카드";
    }
	
    function selectCard(cardId) {
        selectedCardId = cardId;
        renderAll();
    }
    function getSelectedCard() {
        return cards.find(function (card) {
            return card.id === selectedCardId;
        });
    }
    function renderSettings() {
        const card = getSelectedCard();
        if (!card) {
            selectedCardTitle.textContent = "아이템 카드를 선택해주세요.";
            emptySetting.classList.remove("hidden");
            cardSettingArea.classList.add("hidden");
            toggleCardVisibleBtn.disabled = true;
            deleteCardBtn.disabled = true;
            return;
        }
        selectedCardTitle.textContent = getCardDisplayName(card);
        emptySetting.classList.add("hidden");
        cardSettingArea.classList.remove("hidden");
        toggleCardVisibleBtn.disabled = false;
        deleteCardBtn.disabled = false;
        toggleCardVisibleBtn.textContent = card.visible ? "숨김" : "표시";
        setChecked("#showKorean", card.showKo);
        setChecked("#showJapanese", card.showJa);
        setChecked("#showEnglish", card.showEn);
        setChecked("#showItemImage", card.showImage);
        setValue("#itemNameKo", card.nameKo);
        setValue("#itemNameJa", card.nameJa);
        setValue("#itemNameEn", card.nameEn);
        setValue("#itemImageUrl", card.imageUrl);
        setValue("#cardX", Math.round(card.cx - card.width / 2));
        setValue("#cardY", Math.round(card.cy - card.height / 2));
        setValue("#cardWidth", Math.round(card.width));
        setValue("#cardHeight", Math.round(card.height));
        setValue("#cardRotation", Math.round(card.rotation));
        setValue("#cardRotationNumber", Math.round(card.rotation));
        setValue("#fontFamily", card.fontFamily);
        setValue("#fontSize", card.fontSize);
        setValue("#fontWeight", card.fontWeight);
        setValue("#lineHeight", card.lineHeight);
        setValue("#textAlign", card.textAlign);
        setValue("#textColor", card.textColor);
		setValue("#textOpacity", card.textOpacity ?? 100);
		setValue("#textOpacityNumber", card.textOpacity ?? 100);
		setValue("#itemImageSize", card.itemImageSize);
        setValue("#itemImageSize", card.itemImageSize);
        setValue("#backgroundColor", card.backgroundColor);
        setValue("#backgroundOpacity", card.backgroundOpacity);
        setValue("#backgroundOpacityNumber", card.backgroundOpacity);
        setValue("#cardPadding", card.padding);
        setValue("#cardGap", card.gap);
        setValue("#borderWidth", card.borderWidth);
        setValue("#borderRadius", card.borderRadius);
        setValue("#borderColor", card.borderColor);
        setValue("#borderStyle", card.borderStyle);
		updateDyeButton(1, card.dye1Name, card.dye1Color, card.dyeCount >= 1);
		updateDyeButton(2, card.dye2Name, card.dye2Color, card.dyeCount >= 2);
    }
    function updateDyeButton(number, name, color, enabled) {
        const button = document.querySelector("#dye" + number + "Btn");
        const text = document.querySelector("#dye" + number + "BtnText");
        const preview = document.querySelector("#dye" + number + "ColorPreview");
        if (!button || !text || !preview) return;
        button.disabled = !enabled;
        text.textContent = !enabled ? "염료 " + number + " 사용 불가" : (name ? name : "염료 " + number + " 선택");
        preview.style.backgroundColor = enabled && name && color ? color : "transparent";
    }
    function toggleSelectedCard() {
        const card = getSelectedCard();
        if (!card) {
            return;
        }
        card.visible = !card.visible;
        renderAll();
    }
    function deleteSelectedCard() {
        if (!selectedCardId) {
            return;
        }
        if (!confirm("선택한 아이템 카드를 삭제하시겠습니까?")) {
            return;
        }
        const index = cards.findIndex(function (card) {
            return card.id === selectedCardId;
        });
        cards.splice(index, 1);
        selectedCardId = cards.length > 0 ? cards[Math.max(0, index - 1)].id : null;
        renderAll();
    }
    function startDrag(event) {
        if (event.button !== 0) {
            return;
        }
        const cardElement = event.currentTarget.closest(".item-card");
        const card = findCard(cardElement.dataset.cardId);
        if (!card) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        selectedCardId = card.id;
        pointerAction = {
            type: "drag",
            card: card,
            startX: event.clientX,
            startY: event.clientY,
            startCx: card.cx,
            startCy: card.cy
        };
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", finishPointerAction);
        renderCardList();
        renderSettings();
    }
    function startResize(event) {
        const cardElement = event.currentTarget.closest(".item-card");
        const card = findCard(cardElement.dataset.cardId);
        if (!card) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        selectedCardId = card.id;
        pointerAction = {
            type: "resize",
            card: card,
            direction: event.currentTarget.dataset.direction,
            startX: event.clientX,
            startY: event.clientY,
            startCx: card.cx,
            startCy: card.cy,
            startWidth: card.width,
            startHeight: card.height,
            rotation: card.rotation
        };
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", finishPointerAction);
    }
    function startRotate(event) {
        const cardElement = event.currentTarget.closest(".item-card");
        const card = findCard(cardElement.dataset.cardId);
        const rect = cardElement.getBoundingClientRect();
        if (!card) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        selectedCardId = card.id;
        pointerAction = {
            type: "rotate",
            card: card,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", finishPointerAction);
    }
    function handlePointerMove(event) {
        if (!pointerAction) {
            return;
        }
        if (pointerAction.type === "drag") {
            moveCardByPointer(event);
        } else if (pointerAction.type === "resize") {
            resizeCardByPointer(event);
        } else if (pointerAction.type === "rotate") {
            rotateCardByPointer(event);
        }
    }
    function moveCardByPointer(event) {
        const action = pointerAction;
        const card = action.card;
        const dx = (event.clientX - action.startX) / zoom;
        const dy = (event.clientY - action.startY) / zoom;
        card.cx = clamp(action.startCx + dx, card.width / 2, imageWidth - card.width / 2);
        card.cy = clamp(action.startCy + dy, card.height / 2, imageHeight - card.height / 2);
        updateCardElement(card);
        updateTransformInputs(card);
    }
    function resizeCardByPointer(event) {
        const action = pointerAction;
        const card = action.card;
        const worldDx = (event.clientX - action.startX) / zoom;
        const worldDy = (event.clientY - action.startY) / zoom;
        const radians = action.rotation * Math.PI / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const localDx = worldDx * cos + worldDy * sin;
        const localDy = -worldDx * sin + worldDy * cos;
        const direction = action.direction;
        const minWidth = 80;
        const minHeight = 60;
        let left = -action.startWidth / 2;
        let right = action.startWidth / 2;
        let top = -action.startHeight / 2;
        let bottom = action.startHeight / 2;
        if (direction.includes("w")) {
            left += localDx;
        }
        if (direction.includes("e")) {
            right += localDx;
        }
        if (direction.includes("n")) {
            top += localDy;
        }
        if (direction.includes("s")) {
            bottom += localDy;
        }
        if (right - left < minWidth) {
            if (direction.includes("w")) {
                left = right - minWidth;
            } else {
                right = left + minWidth;
            }
        }
        if (bottom - top < minHeight) {
            if (direction.includes("n")) {
                top = bottom - minHeight;
            } else {
                bottom = top + minHeight;
            }
        }
        const localCenterX = (left + right) / 2;
        const localCenterY = (top + bottom) / 2;
        const worldCenterX = localCenterX * cos - localCenterY * sin;
        const worldCenterY = localCenterX * sin + localCenterY * cos;
        card.width = right - left;
        card.height = bottom - top;
        card.cx = action.startCx + worldCenterX;
        card.cy = action.startCy + worldCenterY;
        updateCardElement(card);
        updateTransformInputs(card);
    }
    function rotateCardByPointer(event) {
        const action = pointerAction;
        const angle = Math.atan2(event.clientY - action.centerY, event.clientX - action.centerX) * 180 / Math.PI + 90;
        action.card.rotation = normalizeAngle(angle);
        updateCardElement(action.card);
        updateTransformInputs(action.card);
    }
    function finishPointerAction() {
        pointerAction = null;
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", finishPointerAction);
        updateGroupPositionFields();
    }
    function updateCardElement(card) {
        const element = cardLayer.querySelector('[data-card-id="' + card.id + '"]');
        if (!element) {
            return;
        }
        applyCardPosition(element, card);
    }
    function updateTransformInputs(card) {
        setValue("#cardX", Math.round(card.cx - card.width / 2));
        setValue("#cardY", Math.round(card.cy - card.height / 2));
        setValue("#cardWidth", Math.round(card.width));
        setValue("#cardHeight", Math.round(card.height));
        setValue("#cardRotation", Math.round(card.rotation));
        setValue("#cardRotationNumber", Math.round(card.rotation));
    }
    function findCard(id) {
        return cards.find(function (card) {
            return card.id === id;
        });
    }
	
    function setZoom(percent) {
        let value = Number(percent);
        if (Number.isNaN(value)) {
            value = 100;
        }
        value = clamp(value, 10, 200);
        zoom = value / 100;
        zoomRange.value = value;
        zoomNumber.value = value;
        updateStageScale();
    }
	
	function updateStageScale() {
	    if (!imageWidth || !imageHeight) return;

	    stageScaler.style.width = imageWidth * zoom + "px";
	    stageScaler.style.height = imageHeight * zoom + "px";
	    stageScaler.style.transform = `translate(${panX}px, ${panY}px)`;

	    stage.style.width = imageWidth + "px";
	    stage.style.height = imageHeight + "px";
	    stage.style.transform = "scale(" + zoom + ")";
	}
	
	function fitImageToScreen() {
	    if (!imageWidth || !imageHeight) return;

	    const workspaceStyle = getComputedStyle(imageWorkspace);
	    const paddingX = parseFloat(workspaceStyle.paddingLeft) + parseFloat(workspaceStyle.paddingRight);
	    const availableWidth = imageWorkspace.clientWidth - paddingX;
	    const toolbarBottom = document.querySelector(".image-toolbar").getBoundingClientRect().bottom;
	    const availableHeight = Math.max(300, window.innerHeight - toolbarBottom - 25);
	    const ratio = Math.min(availableWidth / imageWidth, availableHeight / imageHeight, 1);

	    panX = 0;
	    panY = 0;
	    setZoom(Math.max(10, Math.floor(ratio * 100)));
	}
	
	imageWorkspace.addEventListener("dragover", function (event) {
	    event.preventDefault();
	    event.dataTransfer.dropEffect = "copy";
	    imageWorkspace.classList.add("drag-over");
	});

	imageWorkspace.addEventListener("dragleave", function (event) {
	    if (event.relatedTarget && imageWorkspace.contains(event.relatedTarget)) return;
	    imageWorkspace.classList.remove("drag-over");
	});

	imageWorkspace.addEventListener("drop", function (event) {
	    event.preventDefault();
	    imageWorkspace.classList.remove("drag-over");

	    const files = event.dataTransfer.files;
	    if (!files || files.length === 0) return;

	    const file = files[0];

	    if (!file.type.startsWith("image/")) {
	        alert("이미지 파일만 등록할 수 있습니다.");
	        return;
	    }

	    loadBackgroundImage(file);
	});
	
	imageWorkspace.addEventListener("wheel", function (event) {
	    if (!imageWidth || !imageHeight) return;
	    event.preventDefault();

	    const oldZoom = zoom;
	    const oldPercent = Math.round(oldZoom * 100);
	    const step = event.deltaY < 0 ? 5 : -5;
	    const newPercent = clamp(oldPercent + step, 10, 200);
	    const newZoom = newPercent / 100;

	    if (newZoom === oldZoom) return;

	    const scalerRect = stageScaler.getBoundingClientRect();

	    const imageX = (event.clientX - scalerRect.left) / oldZoom;
	    const imageY = (event.clientY - scalerRect.top) / oldZoom;

	    panX += imageX * (oldZoom - newZoom);
	    panY += imageY * (oldZoom - newZoom);

	    setZoom(newPercent);
	}, { passive:false });
	
	imageWorkspace.addEventListener("pointerdown", function (event) {
	    if (!imageWidth || !imageHeight) return;
	    if (event.target.closest(".item-card")) return;
	    if (event.target.closest(".resize-handle")) return;

	    isPanning = true;
	    panStartX = event.clientX;
	    panStartY = event.clientY;

	    imageWorkspace.classList.add("panning");
	    imageWorkspace.setPointerCapture(event.pointerId);
	});

	imageWorkspace.addEventListener("pointermove", function (event) {
	    if (!isPanning) return;

	    const moveX = event.clientX - panStartX;
	    const moveY = event.clientY - panStartY;

	    panX += moveX;
	    panY += moveY;

	    panStartX = event.clientX;
	    panStartY = event.clientY;

	    updateStageScale();
	});

	imageWorkspace.addEventListener("pointerup", function (event) {
	    if (!isPanning) return;

	    isPanning = false;
	    imageWorkspace.classList.remove("panning");

	    if (imageWorkspace.hasPointerCapture(event.pointerId)) {
	        imageWorkspace.releasePointerCapture(event.pointerId);
	    }
	});

	imageWorkspace.addEventListener("pointercancel", function () {
	    isPanning = false;
	    imageWorkspace.classList.remove("panning");
	});
	
    function updateSelectedCardFromSettings() {
        const card = getSelectedCard();
        if (!card) {
            return;
        }
        card.showKo = document.querySelector("#showKorean").checked;
        card.showJa = document.querySelector("#showJapanese").checked;
        card.showEn = document.querySelector("#showEnglish").checked;
        card.showImage = document.querySelector("#showItemImage").checked;
        card.nameKo = document.querySelector("#itemNameKo").value;
        card.nameJa = document.querySelector("#itemNameJa").value;
        card.nameEn = document.querySelector("#itemNameEn").value;
        card.imageUrl = document.querySelector("#itemImageUrl").value.trim();
        card.fontFamily = document.querySelector("#fontFamily").value;
        card.fontSize = getNumber("#fontSize", 22);
        card.fontWeight = document.querySelector("#fontWeight").value;
        card.lineHeight = getNumber("#lineHeight", 1.25);
        card.textAlign = document.querySelector("#textAlign").value;
        card.textColor = document.querySelector("#textColor").value;
		card.textOpacity = getNumber("#textOpacity", 100);
        card.itemImageSize = getNumber("#itemImageSize", 76);
        card.backgroundColor = document.querySelector("#backgroundColor").value;
        card.backgroundOpacity = getNumber("#backgroundOpacity", 85);
        card.padding = getNumber("#cardPadding", 14);
        card.gap = getNumber("#cardGap", 12);
        card.borderWidth = getNumber("#borderWidth", 1);
        card.borderRadius = getNumber("#borderRadius", 10);
        card.borderColor = document.querySelector("#borderColor").value;
        card.borderStyle = document.querySelector("#borderStyle").value;
        renderCards();
        renderCardList();
        selectedCardTitle.textContent = getCardDisplayName(card);
    }
    function updateTransformFromSettings() {
        const card = getSelectedCard();
        if (!card) {
            return;
        }
        const x = getNumber("#cardX", card.cx - card.width / 2);
        const y = getNumber("#cardY", card.cy - card.height / 2);
        const width = Math.max(80, getNumber("#cardWidth", card.width));
        const height = Math.max(60, getNumber("#cardHeight", card.height));
        const rotation = getNumber("#cardRotationNumber", card.rotation);
        card.width = width;
        card.height = height;
        card.cx = x + width / 2;
        card.cy = y + height / 2;
        card.rotation = normalizeAngle(rotation);
        document.querySelector("#cardRotation").value = card.rotation;
        renderCards();
        updateGroupPositionFields();
    }
    const generalSettingSelectors = [
        "#showKorean",
        "#showJapanese",
        "#showEnglish",
        "#showItemImage",
        "#itemNameKo",
        "#itemNameJa",
        "#itemNameEn",
        "#itemImageUrl",
        "#fontFamily",
        "#fontSize",
        "#fontWeight",
        "#lineHeight",
        "#textAlign",
        "#textColor",
        "#itemImageSize",
        "#backgroundColor",
        "#cardPadding",
        "#cardGap",
        "#borderWidth",
        "#borderRadius",
        "#borderColor",
        "#borderStyle"
    ];
    generalSettingSelectors.forEach(function (selector) {
        document.querySelector(selector).addEventListener("input", updateSelectedCardFromSettings);
        document.querySelector(selector).addEventListener("change", updateSelectedCardFromSettings);
    });
    ["#cardX", "#cardY", "#cardWidth", "#cardHeight"].forEach(function (selector) {
        document.querySelector(selector).addEventListener("change", updateTransformFromSettings);
    });
    document.querySelector("#cardRotation").addEventListener("input", function () {
        document.querySelector("#cardRotationNumber").value = this.value;
        updateTransformFromSettings();
    });
    document.querySelector("#cardRotationNumber").addEventListener("input", function () {
        document.querySelector("#cardRotation").value = this.value;
        updateTransformFromSettings();
    });
    document.querySelector("#backgroundOpacity").addEventListener("input", function () {
        document.querySelector("#backgroundOpacityNumber").value = this.value;
        updateSelectedCardFromSettings();
    });
    document.querySelector("#backgroundOpacityNumber").addEventListener("input", function () {
        const value = clamp(Number(this.value) || 0, 0, 100);
        this.value = value;
        document.querySelector("#backgroundOpacity").value = value;
        updateSelectedCardFromSettings();
    });
    document.querySelectorAll("[data-align]").forEach(function (button) {
        button.addEventListener("click", function () {
            alignAllCards(this.dataset.align);
        });
    });
    function alignAllCards(type) {
        if (cards.length === 0 || !imageWidth || !imageHeight) {
            return;
        }
        cards.forEach(function (card) {
            if (type === "left") {
                card.cx = card.width / 2;
            } else if (type === "center") {
                card.cx = imageWidth / 2;
            } else if (type === "right") {
                card.cx = imageWidth - card.width / 2;
            } else if (type === "top") {
                card.cy = card.height / 2;
            } else if (type === "middle") {
                card.cy = imageHeight / 2;
            } else if (type === "bottom") {
                card.cy = imageHeight - card.height / 2;
            }
        });
        renderAll();
    }
    document.querySelector("#distributeHorizontalBtn").addEventListener("click", function () {
        distributeCards("horizontal");
    });
    document.querySelector("#distributeVerticalBtn").addEventListener("click", function () {
        distributeCards("vertical");
    });
    function distributeCards(direction) {
        if (cards.length < 2) {
            alert("균등 분배하려면 아이템 카드가 2개 이상 필요합니다.");
            return;
        }
        const gap = Math.max(0, Number(document.querySelector("#distributionGap").value) || 0);
        if (direction === "horizontal") {
            const sorted = [...cards].sort(function (a, b) {
                return getCardLeft(a) - getCardLeft(b);
            });
            let x = getCardLeft(sorted[0]);
            sorted.forEach(function (card) {
                card.cx = x + card.width / 2;
                x += card.width + gap;
            });
        } else {
            const sorted = [...cards].sort(function (a, b) {
                return getCardTop(a) - getCardTop(b);
            });
            let y = getCardTop(sorted[0]);
            sorted.forEach(function (card) {
                card.cy = y + card.height / 2;
                y += card.height + gap;
            });
        }
        renderAll();
    }
    document.querySelector("#moveGroupBtn").addEventListener("click", function () {
        moveGroup();
    });
    function moveGroup() {
        if (cards.length === 0) {
            return;
        }
        const bounds = getGroupBounds();
        const targetX = Number(document.querySelector("#groupX").value) || 0;
        const targetY = Number(document.querySelector("#groupY").value) || 0;
        const dx = targetX - bounds.left;
        const dy = targetY - bounds.top;
        cards.forEach(function (card) {
            card.cx += dx;
            card.cy += dy;
        });
        renderAll();
    }
    function updateGroupPositionFields() {
        if (cards.length === 0) {
            document.querySelector("#groupX").value = 0;
            document.querySelector("#groupY").value = 0;
            return;
        }
        const bounds = getGroupBounds();
        document.querySelector("#groupX").value = Math.round(bounds.left);
        document.querySelector("#groupY").value = Math.round(bounds.top);
    }
    function getGroupBounds() {
        return {
            left: Math.min(...cards.map(getCardLeft)),
            top: Math.min(...cards.map(getCardTop)),
            right: Math.max(...cards.map(getCardRight)),
            bottom: Math.max(...cards.map(getCardBottom))
        };
    }
    function getCardLeft(card) {
        return card.cx - card.width / 2;
    }
    function getCardRight(card) {
        return card.cx + card.width / 2;
    }
    function getCardTop(card) {
        return card.cy - card.height / 2;
    }
    function getCardBottom(card) {
        return card.cy + card.height / 2;
    }
	async function downloadImage() {
	    if (!imageWidth || !imageHeight) {
	        alert("먼저 편집할 이미지를 불러와주세요.");
	        return;
	    }
	    const currentTransform = stage.style.transform;
	    stage.classList.add("exporting");
	    try {
	        /* 저장할 때는 원본 이미지 크기인 100% 비율로 고정 */
	        stage.style.transform = "scale(1)";
	        const canvas = await html2canvas(stage, {
	            backgroundColor: null,
	            scale: 1,
	            useCORS: true,
	            allowTaint: false,
	            width: imageWidth,
	            height: imageHeight,
	            logging: false
	        });
	        const link = document.createElement("a");
	        link.download = "item-card-image.png";
	        link.href = canvas.toDataURL("image/png");
	        link.click();
	    } catch (error) {
	        console.error("이미지 저장 오류:", error);
	        alert("이미지 저장 중 오류가 발생했습니다.");
	    } finally {
	        /* 저장이 끝나면 사용자가 보고 있던 확대/축소 비율로 복원 */
	        stage.style.transform = currentTransform;
	        stage.classList.remove("exporting");
	    }
	}
    function setValue(selector, value) {
        document.querySelector(selector).value = value ?? "";
    }
    function setChecked(selector, value) {
        document.querySelector(selector).checked = !!value;
    }
    function getNumber(selector, defaultValue) {
        const value = Number(document.querySelector(selector).value);
        return Number.isNaN(value) ? defaultValue : value;
    }
    function normalizeAngle(angle) {
        let result = Number(angle);
        while (result > 180) {
            result -= 360;
        }
        while (result < -180) {
            result += 360;
        }
        return Math.round(result * 10) / 10;
    }
    function hexToRgba(hex, alpha) {
        const value = hex.replace("#", "");
        if (value.length !== 6) {
            return "rgba(0, 0, 0, " + alpha + ")";
        }
        const r = parseInt(value.substring(0, 2), 16);
        const g = parseInt(value.substring(2, 4), 16);
        const b = parseInt(value.substring(4, 6), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }
    function clamp(value, min, max) {
        if (max < min) {
            return min;
        }
        return Math.min(Math.max(value, min), max);
    }
    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;
    }
    function initDyeSelect(number) {
        const button = document.querySelector("#dye" + number + "Btn");
        const dropdown = document.querySelector("#dye" + number + "Dropdown");
        const searchInput = document.querySelector("#dye" + number + "Search");
        if (!button || !dropdown || !searchInput) return;
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            document.querySelectorAll(".dye-dropdown").forEach(function (item) {
                if (item !== dropdown) item.classList.remove("open");
            });
            dropdown.classList.toggle("open");
            if (dropdown.classList.contains("open")) {
                searchInput.value = "";
                renderDyeList(number, "");
                searchInput.focus();
            }
        });
        searchInput.addEventListener("input", function () {
            renderDyeList(number, this.value);
        });
        searchInput.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        dropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        renderDyeList(number, "");
    }
    function renderDyeList(number, keyword) {
        const listElement = document.querySelector("#dye" + number + "List");
        if (!listElement) return;
        const searchKeyword = keyword.trim().toLowerCase();
        const filteredList = dyeList.filter(function (dye) {
            return dye.name.toLowerCase().includes(searchKeyword);
        });
        listElement.innerHTML = "";
        if (filteredList.length === 0) {
            listElement.innerHTML = '<div class="dye-empty">검색된 염료가 없습니다.</div>';
            return;
        }
        filteredList.forEach(function (dye) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dye-list-item";
            button.innerHTML = dye.name === "없음"
                ? '<span class="dye-list-color dye-list-none"></span><span>없음</span>'
                : `<span class="dye-list-color" style="background:${dye.color}"></span><span>${dye.name}</span>`;
            button.addEventListener("click", function () {
                selectDye(number, dye);
            });
            listElement.appendChild(button);
        });
    }
    function selectDye(number, dye) {
        const card = getSelectedCard();
        if (!card) return;
        const none = dye.name === "없음";
        if (number === 1) {
            card.dye1Name = none ? "" : dye.name;
            card.dye1Color = none ? "#ffffff" : dye.color;
            card.showDye1 = !none;
        } else {
            card.dye2Name = none ? "" : dye.name;
            card.dye2Color = none ? "#ffffff" : dye.color;
            card.showDye2 = !none;
        }
        document.querySelector("#dye" + number + "Dropdown").classList.remove("open");
        renderAll();
    }
	
	function applySelectedStyleToAll() {
	    const selectedCard = getSelectedCard();
	    if (!selectedCard) {
	        alert("기준으로 사용할 아이템 카드를 선택해주세요.");
	        return;
	    }

	    if (cards.length <= 1) {
	        alert("적용할 다른 아이템 카드가 없습니다.");
	        return;
	    }

	    if (!confirm("현재 선택한 카드의 디자인을 모든 아이템 카드에 적용하시겠습니까?")) return;

	    cards.forEach(function (card) {
	        if (card.id === selectedCard.id) return;
			card.fontFamily = selectedCard.fontFamily;
			card.fontSize = selectedCard.fontSize;
			card.fontWeight = selectedCard.fontWeight;
			card.lineHeight = selectedCard.lineHeight;
			card.textAlign = selectedCard.textAlign;
			card.itemImageSize = selectedCard.itemImageSize;
			card.textColor = selectedCard.textColor;
			card.textOpacity = selectedCard.textOpacity ?? 100;
			card.backgroundColor = selectedCard.backgroundColor;
			card.backgroundOpacity = selectedCard.backgroundOpacity;
			card.padding = selectedCard.padding;
			card.gap = selectedCard.gap;
			card.borderWidth = selectedCard.borderWidth;
			card.borderRadius = selectedCard.borderRadius;
			card.borderColor = selectedCard.borderColor;
			card.borderStyle = selectedCard.borderStyle;
	    });

	    renderAll();
	}
	
	function rotateBackgroundImage(degree) {
	    if (!backgroundImage.src || !imageWidth || !imageHeight) {
	        alert("먼저 편집할 이미지를 불러와주세요.");
	        return;
	    }

	    const image = new Image();

	    image.onload = function () {
	        const canvas = document.createElement("canvas");
	        canvas.width = imageHeight;
	        canvas.height = imageWidth;

	        const ctx = canvas.getContext("2d");

	        ctx.translate(canvas.width / 2, canvas.height / 2);
	        ctx.rotate(degree * Math.PI / 180);
	        ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2);

	        const oldWidth = imageWidth;
	        const oldHeight = imageHeight;

	        imageWidth = oldHeight;
	        imageHeight = oldWidth;

	        backgroundImage.src = canvas.toDataURL("image/png");

	        stage.style.width = imageWidth + "px";
	        stage.style.height = imageHeight + "px";

	        rotateCardPositions(degree, oldWidth, oldHeight);

	        panX = 0;
	        panY = 0;

	        renderAll();

	        requestAnimationFrame(function () {
	            fitImageToScreen();
	        });
	    };
		
		function rotateCardPositions(degree, oldWidth, oldHeight) {
		    cards.forEach(function (card) {
		        const oldCx = card.cx;
		        const oldCy = card.cy;

		        if (degree === 90) {
		            card.cx = oldHeight - oldCy;
		            card.cy = oldCx;
		        } else {
		            card.cx = oldCy;
		            card.cy = oldWidth - oldCx;
		        }

		        card.rotation = (card.rotation + degree + 360) % 360;
		    });
		}

	    image.src = backgroundImage.src;
	}
	
    renderAll();
});
