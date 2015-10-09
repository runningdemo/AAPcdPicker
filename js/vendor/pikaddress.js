/**
 * Created by chenliang on 7/7/15.
 */
(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function ()
        {
            return factory();
        });
    } else {
        root.Pikaddress = factory();
    }
}(this, function () {
    // some constant
    var kTABS = 'pikaddress-tabs',
        kTAB = 'pikaddress-tab',
        kTAB__SELECTED = 'pikaddress-tab--selected',
        kTAB_OFTEN = 'pikaddress-tabOften',
        kCONTENT_OFTEN = 'pikaddress-contentOften',
        kTAB_PROVINCE = 'pikaddress-tabProvince',
        kCONTENT_PROVINCE = 'pikaddress-contentProvince',
        kTAB_CITY = 'pikaddress-tabCity',
        kCONTENT_CITY = 'pikaddress-contentCity',
        kTAB_COUNTRY = 'pikaddress-tabCountry',
        kCONTENT_COUNTRY = 'pikaddress-contentCountry',
        kDOMADDRESS = 'pikaddress-address',
        kDOMADDRESS__SELECTED = 'pikaddress-address--selected',
        KDOMADDRESS__HOVER = 'pikaddress-address--hover';


    var defaults = {
            districtsData: null,
            field: null,
            district: null,
            onSelectDone: null
        },
        renderTabs = function () {
            var $tabs = $('<div />', {
                class: 'pikaddress-tabs clearfix'
            });

            var $tabOften = $('<div />', {
                class: 'pikaddress-tab pikaddress-tabOften pikaddress-tab--selected',
            }).append('<span class="pikaddress-tab-sapn">常用</span>');
            ;

            var $tabProvince = $('<div />', {
                class: 'pikaddress-tab pikaddress-tabProvince',
            }).append('<span class="pikaddress-tab-sapn">省</span>');

            var $tabCity = $('<div />', {
                class: 'pikaddress-tab pikaddress-tabCity',
            }).append('<span class="pikaddress-tab-sapn">市</span>');
            ;

            var $tabCountry = $('<div />', {
                class: 'pikaddress-tab pikaddress-tabCountry',
            }).append('<span class="pikaddress-tab-sapn">区县</span>');
            ;

            $tabs.append($tabOften, $tabProvince, $tabCity, $tabCountry);
            return $tabs;
        },
        renderContentOften = function (data) {
            var $eleOften = $('<div />', {
                class: kCONTENT_OFTEN,
            })
            var selectedDistrict = data.district;
            var districtArray = data.districtsOften;
            for (var i = 0; i < districtArray.length; i++) {
                var district = districtArray[i];
                var $districtEle = $('<span/>', {
                    class: kDOMADDRESS + (selectedDistrict == district ? ' ' + kDOMADDRESS__SELECTED : ''),
                    'data-district': district,
                    html: district.split('-').slice(-1)[0]
                });
                $eleOften.append($districtEle);
            }
            return $eleOften;
        },
        renderContentProvince = function (data) {
            var $eleProvince = $('<div />', {
                class: kCONTENT_PROVINCE,
            });

            var districts = data.districtsData;
            var selectedDistrict = data.district;

            for (var i = 0; i < districts.length; i++) {
                var district = districts[i];
                var provinceName = district['name'];
                var $districtEle = $('<span/>', {
                    class: kDOMADDRESS + (selectedDistrict && provinceName == getProvinceName(selectedDistrict) ? ' ' + kDOMADDRESS__SELECTED : ''),
                    'data-district': provinceName, // eg: '江苏省'
                    html: provinceName
                });
                $eleProvince.append($districtEle);
            }
            return $eleProvince;

        },
        renderContentCity = function (data) {
            var $eleCity = $('<div />', {
                class: kCONTENT_CITY,
                backgroundColor: 'blue'
            })
            var provinceName = getProvinceName(data.district),
                selectedCityName = getCityName(data.district),
                citysInProvince = getCitiesOfProvince(provinceName, data.districtsData);

            for (var i = 0; i < citysInProvince.length; i++) {
                var cityName = citysInProvince[i]['name'];
                var $cityEle = $('<span/>', {
                    class: kDOMADDRESS + (selectedCityName && selectedCityName == cityName ? ' ' + kDOMADDRESS__SELECTED : ''),
                    'data-district': provinceName + '-' + cityName,
                    html: cityName
                });
                $eleCity.append($cityEle);

            }
            return $eleCity;

        },
        renderContentCountry = function (data) {
            var $eleCountry = $('<div />', {
                class: kCONTENT_COUNTRY,
                backgroundColor: 'red'
            })

            var provinceName = getProvinceName(data.district),
                cityName = getCityName(data.district),
                selectedContryName = getCountryName(data.district),
                countriesInCity = getCountriesOfCity(provinceName, cityName, data.districtsData);

            for (var i = 0; i < countriesInCity.length; i++) {
                var countryName = countriesInCity[i];
                var $countryEle = $('<span/>', {
                    class: kDOMADDRESS + (selectedContryName && selectedContryName == countryName ? ' ' + kDOMADDRESS__SELECTED : ''),
                    'data-district': provinceName + '-' + cityName + '-' + countryName,
                    html: countryName
                });
                $eleCountry.append($countryEle);
            }
            return $eleCountry;
        },
        getProvinceName = function (district) {
            return district.split('-')[0];
        },
        getCityName = function (district) { // note: must ensure that have city
            return district.split('-')[1];
        },
        getCountryName = function (distric) {// note: must ensure that have country after split
            return distric.split('-')[2];
        },
        getCitiesOfProvince = function (provinceName, data) {
            var cities = [];
            for (var i = 0; i < data.length; i++) {
                var pName = data[i]['name'];
                if (pName == provinceName) {
                    cities = data[i]['city'];
                    break;
                }
            }
            return cities;
        },
        getCountriesOfCity = function (provinceName, cityName, data) {
            var cities = getCitiesOfProvince(provinceName, data),
                countries = [];
            for (var i = 0; i < cities.length; i++) {
                if (cities[i]['name'] == cityName) {
                    countries = cities[i]['area']
                    break;
                }
            }
            return countries;
        }


    var isClickOnElement = function (e, ele) {
        var x = e.clientX;
        var y = e.clientY;
        var eleW = $(ele).width();
        var eleH = $(ele).height();
        var eleL = $(ele).position().left;
        var eleT = $(ele).position().top;
        if ((eleL <= x && x <= eleL + eleW) && (eleT <= y && y <= eleT + eleH)) {
            return true;
        } else {
            return false;
        }
    }

    Pikaddress = function (options) {
        var self = this,
            opts = this.config(options);


        self._onMousedown = function (e) {
            console.log('pika click');
            e.stopPropagation()
            var $target = $(e.target),
                $tabs = self.el.find('.pikaddress-tab');

            // case1: 点击tab
            if ($target.hasClass('pikaddress-tab') || $target.parent().hasClass(kTAB)) {
                var $tab;
                if ($target.hasClass(kTAB)) {
                    $tab = $target;
                } else if ($target.parent().hasClass(kTAB)) {
                    $tab = $target.parent();
                }
                if ($tab.hasClass('pikaddress-tab--selected')) {
                    return;
                }


                // 常用
                if ($tab.hasClass(kTAB_OFTEN)) {
                    self.switchToTabContent(kTAB_OFTEN);
                }
                // 省
                if ($tab.hasClass(kTAB_PROVINCE)) {
                    self.switchToTabContent(kTAB_PROVINCE);
                }
                // 市
                if ($tab.hasClass(kTAB_CITY)) {
                    self.switchToTabContent(kTAB_CITY);
                }
                // 区县
                if ($tab.hasClass(kTAB_COUNTRY)) {
                    self.switchToTabContent(kTAB_COUNTRY);
                }

            }

            // case2: 点击district-address
            if ($target.hasClass(kDOMADDRESS)) {
                //if ($target.hasClass(kDOMADDRESS__SELECTED)) {
                //  return;
                //}
                var selectedDistrict = $target.attr('data-district');
                self._o.district = selectedDistrict;

                var isDistrictProvince = selectedDistrict.split('-').length == 1,
                    isDistrictCity = selectedDistrict.split('-').length == 2,
                    isDistrictCountry = selectedDistrict.split('-').length == 3;

                if (isDistrictProvince) {
                    self.switchToTabContent(kTAB_CITY)
                    return;
                }
                if (isDistrictCity) {
                    self.switchToTabContent(kTAB_COUNTRY)
                    return;
                }
                if (isDistrictCountry) {
                    if (self._o.onSelectDone) {
                        self._o.onSelectDone();
                    }
                    return;
                }

            }


        };

        self._onClick = function (e) {
            console.log('body click');
            var pEl = e.target;
            if (!pEl) return;
            console.log(pEl);

            if (pEl === opts.field) {
                return;
            }
            self.hide();
        }

        self._onFieldClick = function (e) {
            e.stopPropagation();
            if(self._o.onFieldFocus) {
                self._o.onFieldFocus();
            }
            self.show();
        }

        self.el = $('<div />', {
            class: 'pikaddress'
        });
        self.el.on('click', self._onMousedown);
        opts.$field.on('click', self._onFieldClick);
        self.el.appendTo($(document.body));
        self.hide();
    }


    Pikaddress.prototype = {
        config: function (options) {
            this._o = $.extend({}, defaults, options);
            this._o.$field = $(this._o.field);
            return this._o;
        },

        //
        switchToTabContent: function (tabname) {
            var $tabs = this.el.find('.pikaddress-tab'),
                $tab = this.el.find('.' + tabname);
            $tabs.removeClass('pikaddress-tab--selected');
            $tab.addClass('pikaddress-tab--selected');

            var $contentContainer = this.el.find('.pikaddress-content');
            $contentContainer.empty();

            if (tabname == kTAB_OFTEN) {
                $contentContainer.append(renderContentOften(this._o));
            }
            if (tabname == kTAB_PROVINCE) {
                $contentContainer.append(renderContentProvince(this._o));
            }
            if (tabname == kTAB_CITY) {
                $contentContainer.append(renderContentCity(this._o));
            }
            if (tabname == kTAB_COUNTRY) {
                $contentContainer.append(renderContentCountry(this._o));
            }
        },
        switchToSelectedTabContent: function () {
            var $selectedTab = this.el.find('.' + kTAB__SELECTED);
            var selectedTabName = '';
            if ($selectedTab.hasClass(kTAB_OFTEN)) {
                selectedTabName = kTAB_OFTEN;
            }
            if ($selectedTab.hasClass(kTAB_PROVINCE)) {
                selectedTabName = kTAB_PROVINCE;
            }
            if ($selectedTab.hasClass(kTAB_CITY)) {
                selectedTabName = kTAB_CITY;
            }
            if ($selectedTab.hasClass(kTAB_COUNTRY)) {
                selectedTabName = kTAB_COUNTRY;
            }
            this.switchToTabContent(selectedTabName)

        },

        // refresh the view
        draw: function () {
            var $el = $(this.el);

            var $tabs = renderTabs();
            $el.empty();
            $el.append($tabs)

            var $contentContainer = $('<div/>', {
                class: 'pikaddress-content'
            });
            $el.append($contentContainer);
            this.switchToSelectedTabContent();
        },

        adjustPosition: function () {
            var $field = $(this._o.field),
                $el = this.el;
            var x = $field.position().left,
                y = $field.position().top + $field.height();

            $el.css({
                position: 'absolute',
                top: y + 1,
                left: x,
            });
        },
        show: function () {
            if (this._v) {
                return;
            }
            this._v = true;
            $(document).on('click', this._onClick);
            this.draw();
            this.adjustPosition();
            this.el.show();

        },
        hide: function () {
            console.log('hide');
            this._v = false;
            this.el.hide();
            $(document).off('click', this._onClick);

        },
    }
    return Pikaddress;
}))


