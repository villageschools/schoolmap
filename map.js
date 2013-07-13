function interactiveMap(locations, el, options) {

    var thisMap = this;

    this.el = el;
    this.locations = locations;
    this.map = null;

    this.options = this.defaultOptions;
    for (var item in options) {
        this.options[item] = options[item];
    }

    google.maps.event.addDomListener(window, 'load', function() { thisMap.init() });
}

interactiveMap.prototype.defaultOptions = {
    zoom: 6,
    center: { 
        // Most of Tanzania and Malawi visible
        lat: -9.664608, 
        lng: 34.804688
    },
    type: "TERRAIN"
}

interactiveMap.prototype.init = function() {

    var mapOptions = {
        zoom: this.options.zoom,
        center: new google.maps.LatLng(this.options.center.lat, this.options.center.lng), 
        mapTypeId: google.maps.MapTypeId[this.options.type]
    };

    this.map = new google.maps.Map(this.el, mapOptions);

    for (var l in this.locations) {
        this.placeOnMap(this.locations[l]);
    }

    re = new RegExp(/#(\w+)$/);
    matches = re.exec(window.location);

    if (matches)
        this.openInfoWindow([matches[1]]);
}

interactiveMap.prototype.openInfoWindow = function(locationKey) {
    for (var l in this.locations) {
        if (this.locations[l].infoWindow)
            this.locations[l].infoWindow.close();
    }

    this.locations[locationKey].infoWindow.open(this.map);
}

interactiveMap.prototype.placeOnMap = function(location) {
    if (location.point != null) {
        var thisMap = this;
        var latlng = new google.maps.LatLng(location.point[0], location.point[1]);

        location.marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            icon: { 
                url: location.icon,
                scaledSize: new google.maps.Size(40, 40),
            }
        });

        location.infoWindow = new google.maps.InfoWindow({
            content: location.html,
            position: latlng,
            pixelOffset: new google.maps.Size(0, -30)
        });

        google.maps.event.addDomListener(location.marker, "click", function() {
            thisMap.openInfoWindow(location.name);
        });
    }
}

function school(info) {
    var s = this;
    
    this.html = "";
    this.point = null;
    
    for (i in info)
        this[i] = info[i];
    
    // Won't be overriding this one
    this.icon = "http://www.villageschools.org/new/sites/all/themes/vst/images/vst-logo-bubble2.png";
    this.html = "<div class=\"school-bubble\"><strong>" + this.title + "</strong><br />" + 
                    (this.picture != "" ? "<img class=\"school-photo\" style=\"height: 150px\" src=\"" + DIR_WEB_ROOT + "/" + this.picture + "\" /><br />" : "") + 
                    this.teaser + "<br /><br />" + 
                    "<a href=\"" + DIR_WEB_ROOT + "/schools/" + this.name.replace(/[^\w]/g, "") + "\">more info &raquo;</a>" +
               "</div>";

}