function setPaging(element, ) {
    var html = `<mdui-segmented-button-group id="page" class="mt-3">
                <div style="margin-left:5px">
                    <mdui-chip>
                        <mdui-icon name="arrow_back"></mdui-icon>
                    </mdui-chip>
                    <mdui-chip elevated>1</mdui-chip>
                    <mdui-chip>2</mdui-chip>
                    <mdui-chip>3</mdui-chip>
                    <mdui-chip>3</mdui-chip>
                    <mdui-chip>3</mdui-chip>
                    <mdui-dropdown placement="top-start">
                        <mdui-chip slot="trigger">...</mdui-chip>
                        <mdui-card class="p-3" variant="elevated" style="height:124px;width:124px">
                            <mdui-text-field class="ll" ll="59" variant="filled" label="页码" type="number"></mdui-text-field>
                            <mdui-button class="l mt-1" lang="58" variant="tonal">跳转到</mdui-button>
                        </mdui-card>
                    </mdui-dropdown>
                    <mdui-chip>9</mdui-chip>
                    <mdui-chip>
                        <mdui-icon name="arrow_forward"></mdui-icon>
                    </mdui-chip>
                </div>
            </mdui-segmented-button-group>`;
    element.html(html);
}
class Paging {

    page = 1;

    constructor(element) {
        this.element = element;
    }

    set(page, count) {
        this.count = count;
        if (page > count || page < 1) return;
        this.page = page;
        let list = [1];
        if (page > 3) {
            list.push(0);
        } else if (page > 2) {
            list.push(2);
        }
        if (page != 1 && page != count) list.push(page);
        if (page < count - 2) {
            list.push(0);
        } else if (page < count - 1) {
            list.push(count - 1);
        }
        if (count != 1) list.push(count);
        
        this.element.html(`<mdui-segmented-button-group class="mt-3"><div id="paging-index"></div></mdui-segmented-button-group>`);
        if (page > 1) $("#paging-index").append(`<mdui-chip onclick="paging.first()"><mdui-icon name="arrow_back"></mdui-icon></mdui-chip>`);
        var j = 0;
        for (var i in list) {
            if (list[i] == 0) {
                $("#paging-index").append(`
                    <mdui-dropdown placement="top">
                        <mdui-chip slot="trigger">...</mdui-chip>
                        <mdui-card class="p-3" variant="elevated" style="height:124px;width:124px">
                            <mdui-text-field class="ll paging-input-${j}" ll="59" variant="filled" label="页码" type="number"></mdui-text-field>
                            <mdui-button class="l mt-1" lang="58" variant="tonal" onclick="paging.to($('.paging-input-${j}').val())">跳转到</mdui-button>
                        </mdui-card>
                    </mdui-dropdown>
                `);
                j++;
            } else {
                $("#paging-index").append(`<mdui-chip ${page == list[i]? "elevated": ""}` + (page == list[i]? "": `onclick="paging.to(${list[i]})"`) +`>${list[i]}</mdui-chip>`);
            }
        }
        if (page < count) $("#paging-index").append(`<mdui-chip onclick="paging.last()"><mdui-icon name="arrow_forward"></mdui-icon></mdui-chip>`);
    }

    getPage() {
        return this.page;
    }

    first() {
        search(word, this.page - 1, true);
    }

    last() {
        search(word, this.page + 1, true);
    }

    to(page) {
        if (page < 1 || page > this.count) {
            mdui.alert({headline: lang[181]});
            return;
        }
        search(word, Number.parseInt(page), true);
    }
}