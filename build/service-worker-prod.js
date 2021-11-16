(function () {
    'use strict'

    const isLocalhost = Boolean(window.location.hostname === 'localhost' || window.location.hostname === '[::1]' || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))

    window.addEventListener('load', function () {
        if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
            navigator.serviceWorker.register('service-worker.js').then(function (registration) {
                registration.onupdatefound = function () {
                    if (navigator.serviceWorker.controller) {
                        let installingWorker = registration.installing

                        installingWorker.onstatechange = function () {
                            switch (installingWorker.state) {
                                case 'installed':
                                    break

                                case 'redundant':
                                    throw new Error('The installing service worker became redundant.')
                                    break

                                default:
                                    break
                            }
                        }
                    }
                }
            }).catch(function (exception) {
                console.error('Error during service worker registration:', exception)
            })
        }

        setInterval(function() {
            var todoItems           = []
            var notificationIndexes = []

            for (var index = 0; index < localStorage.length; ++index) {
                todoItems.push(JSON.parse(localStorage.getItem(index)))
            }

            for (var index = 0; index < todoItems.length; ++index) {
                var today       = new Date()
                var tomorrow    = new Date()
                var todoDueDate = new Date(todoItems[index].todoDueDate)

                tomorrow.setDate(today.getDate() + 1)

                var convertedToday       = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                var convertedTomorrow    = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
                var convertedTodoDueDate = new Date(todoDueDate.getFullYear(), todoDueDate.getMonth(), todoDueDate.getDate())

                if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
                    continue
                }

                if (today.getHours() != 0 || todoItems[index].todoState == 2) {
                    continue
                }

                if (convertedTodoDueDate.getTime() == convertedToday.getTime() || convertedTodoDueDate.getTime() == convertedTomorrow.getTime()) {
                    notificationIndexes.push(index)
                }
            }

            navigator.serviceWorker.getRegistration().then((registration) => {
                for (var index = 0; index < notificationIndexes.length; ++index) {
                    var title               = todoItems[notificationIndexes[index]].todoTitle
                    var notificationOptions = { body: todoItems[notificationIndexes[index]].todoDueDate }

                    registration.showNotification(title, notificationOptions)
                }
            })
        }, 3600000)
    })
})()