interface GradeType {
    id: number;
    type: string;
    name: string;
    charts: Array<string>;
    primary: boolean;
    multipitchOnly: boolean;
}

class GradeService {
    public types: Array<GradeType>
    public charts: Record<string, Array<string>>

    constructor () {
      this.types = [
        {
          id: 0,
          type: 'combined',
          name: 'Combined climbing',
          charts: ['fr_combined', 'uiaa'],
          primary: false,
          multipitchOnly: true
        },
        {
          id: 1,
          type: 'mix',
          name: 'Mix climbing',
          charts: ['mix'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 2,
          type: 'alpine',
          name: 'Alpine climbing',
          charts: ['alpine'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 3,
          type: 'tehnical',
          name: 'Tehnical climbing',
          charts: ['tehnical'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 4,
          type: 'required',
          name: 'Required grade',
          charts: ['fr', 'uiaa', 'ydr'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 5,
          type: 'ice',
          name: 'Ice climbing',
          charts: ['ice'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 6,
          type: 'incline',
          name: 'Incline',
          charts: ['incline'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 7,
          type: 'avg_incline',
          name: 'Average incline',
          charts: ['incline'],
          primary: false,
          multipitchOnly: true
        },
        {
          id: 8,
          type: 'rng_from_incline',
          name: 'Minimum incline',
          charts: ['incline'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 9,
          type: 'rng_to_incline',
          name: 'Maximum incline',
          charts: ['incline'],
          primary: false,
          multipitchOnly: false
        },
        {
          id: 10,
          type: 'max',
          name: 'Free climbing grade',
          charts: ['fr', 'uiaa', 'ydr'],
          primary: true,
          multipitchOnly: false
        },
        {
          id: 11,
          type: 'avg',
          name: ' Average route grade',
          charts: ['fr', 'uiaa', 'ydr'],
          primary: true,
          multipitchOnly: true
        }
      ]
      this.charts = {
        fr: ['-', '1', '1', '1', '2', '2', '3', '3', '4a', '4a/a+', '4a+', '4a+/b', '4b', '4b/b+', '4b+', '4b+/c', '4c', '4c/c+', '4c+', '4c+/5a', '5a', '5a/a+', '5a+', '5a+/b', '5b', '5b/b+', '5b+', '5b+/c', '5c', '5c/c+', '5c+', '5c+/6a', '6a', '6a/a+', '6a+', '6a+/b', '6b', '6b/b+', '6b+', '6b+/c', '6c', '6c/c+', '6c+', '6c+/7a', '7a', '7a/a+', '7a+', '7a+/b', '7b', '7b/b+', '7b+', '7b+/c', '7c', '7c/c+', '7c+', '7c+/8a', '8a', '8a/a+', '8a+', '8a+/b', '8b', '8b/b+', '8b+', '8b+/c', '8c', '8c/c+', '8c+', '8c+/9a', '9a', '9a/a+', '9a+', '9a+/b', '9b'],
        uiaa: ['-', 'I', 'I-II', 'II', 'II-III', 'III', 'III-IV', 'IV-', 'IV', 'IV+', 'IV+', 'IV-V', 'IV-V', 'V-', 'V-', 'V', 'V', 'V', 'V+', 'V+', 'V+', 'V-VI', 'VI-', 'VI-', 'VI-', 'VI', 'VI', 'VI', 'VI', 'VI+', 'VI+', 'VI+', 'VI-VII', 'VII-', 'VII-', 'VII-', 'VII', 'VII', 'VII+', 'VII+', 'VII-VIII', 'VIII-', 'VIII-', 'VIII', 'VIII', 'VIII', 'VIII+', 'VIII+', 'VIII-IX', 'IX-', 'IX-', 'IX--IX', 'IX', 'IX', 'IX+', 'IX+', 'IX-X', 'X-', 'X-', 'X--X', 'X', 'X', 'X-X+', 'X+', 'X-XI', 'XI-', 'XI--XI', 'XI', 'XI-XI+', 'XI+', 'XI+', 'XI-XII', 'XII-'],
        ydr: ['-', '5.1', '5.1', '5.2', '5.3', '5.3', '5.4', '5.4', '5.5', '5.5', '5.6', '5.6', '5.6', '5.6', '5.6', '5.7', '5.7', '5.7', '5.7', '5.8', '5.8', '5.8', '5.8', '5.9', '5.9', '5.9', '5.10a', '5.10a', '5.10a', '5.10a', '5.10b', '5.10b', '5.10b', '5.10b', '5.10c', '5.10c', '5.10d', '5.10d', '5.11a', '5.11a', '5.11b', '5.11c', '5.11c', '5.11d', '5.11d', '5.12a', '5.12a', '5.12b', '5.12b', '5.12c', '5.12c', '5.12d', '5.12d', '5.13a', '5.13a', '5.13b', '5.13b', '5.13c', '5.13c', '5.13d', '5.13d', '5.14a', '5.14a', '5.14b', '5.14b', '5.14c', '5.14c', '5.14d', '5.14d', '5.15a', '5.15a', '5.15b', '5.15b'],
        tehnical: ['-', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
        incline: ['-', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90'],
        ice: ['-', 'WI1', 'WI2', 'WI3', 'WI3+', 'WI4-', 'WI4', 'WI4+', 'WI5-', 'WI5', 'WI5+', 'WI6-', 'WI6', 'WI6+', 'WI7-', 'WI7', 'WI7+', 'WI8-', 'WI8', 'WI8+'],
        alpine: ['-', 'AI1', 'AI2', 'AI3', 'AI3+', 'AI4-', 'AI4', 'AI4+', 'AI5-', 'AI5', 'AI5+', 'AI6-', 'AI6', 'AI6+', 'AI7-', 'AI7', 'AI7+', 'AI8-', 'AI8', 'AI8+'],
        mix: ['-', 'M1', 'M2', 'M3', 'M4', 'M5-', 'M5', 'M5+', 'M6-', 'M6', 'M6+', 'M7-', 'M7', 'M7+', 'M8-', 'M8', 'M8+', 'M9-', 'M9', 'M9+', 'M10-', 'M10', 'M10+', 'M11-', 'M11', 'M11+', 'M12-', 'M12', 'M12+', 'M13-', 'M13', 'M13+'],
        // eslint-disable-next-line @typescript-eslint/camelcase
        fr_combined: ['-', 'F-', 'F-', 'F', 'F+', 'PD-', 'PD', 'PD+', 'AD-', 'AD', 'AD+', 'D-', 'D', 'D+', 'TD-', 'TD', 'TD+', 'ED-', 'ED', 'ED+', 'ABO-', 'ABO', 'ABO+']
      }
    }

    getGradeValue (typeId: number, weight: number) {
      return this.charts[this.types[typeId].charts[0]][weight]
    }

    // returns grades for pitch or route
    // if type is pitch then returns all grade types except combined - 0, avg_incline - 7, avg - 11
    // it is beeing compared to 1 because route singlepitch type is id 1
    getGradesFor (type: number) {
      type = type || 0

      if (type === 1) {
        const skip = [0, 7, 11]
        return this.types.filter(grade => {
          return !skip.includes(grade.id)
        })
      }
      return this.types
    }

    getGradesForSliders (multipitch: boolean, primary: boolean) {
      const grades = {}

      this.types.forEach(gradeType => {

        if(!multipitch && gradeType.multipitchOnly ) {
          return
        }

        if (gradeType.primary !== primary) {
          return
        }
        grades[gradeType.id] = {}
        grades[gradeType.id].grade = gradeType
        grades[gradeType.id].maxGrades = this.charts[gradeType.charts[0]].length - 1
        grades[gradeType.id].tickLabels = this.charts[gradeType.charts[0]]
      })
      
      return grades
    }

    forge (grades: Array<Array<number>>) {
      grades = grades || []

      // combined mix,max(required, tehnical)/avg,ice,alpine,incline/avg_incline,rng_from_incline-rng_to_incline
      // 'VI- M6-,VII(VIII-,A3)/X+,WI5-,AI5,90°/80°,70°-60°'
      // 'AD M5+,VI(IV+,A2),WI4,AI5-,90°/80°'
      // '4b+(A3,Obl: 4c+),M3,WI4,AI5-,90°'
      // '4b+'
      // 'VI+/V-VI'
      // 'VI+,A1/V-VI'

      // combined mix,max(required, tehnical)/avg,ice,alpine,incline/avg_incline,rng_from_incline-rng_to_incline

      const gradeObj = {}
      let gradeString = ''
      // mapping grades by type_id
      grades.forEach((grade) => {
        gradeObj[grade[0]] = grade[1]
      })

      // combined grade
      gradeString = (0 in gradeObj) ? this.getGradeValue(0, gradeObj[0]) + ' ' : ''

      // mix grade
      gradeString += (1 in gradeObj) ? this.getGradeValue(1, gradeObj[1]) : ''

      // comma before max grade if all conditions are met
      if (gradeString !== '' && gradeString.slice(-1) !== ' ' && (10 in gradeObj)) {
        gradeString += ','
      }

      // max grade
      gradeString += (10 in gradeObj) ? this.getGradeValue(10, gradeObj[10]) : ''

      // combining tehnical and required grade
      if (3 in gradeObj && 4 in gradeObj) {
        gradeString += '(' + this.getGradeValue(4, gradeObj[4]) + ', ' + this.getGradeValue(3, gradeObj[3]) + ')'
      } else if (3 in gradeObj) {
        gradeString += '(' + this.getGradeValue(3, gradeObj[3]) + ')'
      } else if (4 in gradeObj) {
        gradeString += '(' + this.getGradeValue(4, gradeObj[4]) + ')'
      }

      // average grade
      gradeString += (11 in gradeObj) ? '/' + this.getGradeValue(11, gradeObj[11]) : ''
      // ice grade
      gradeString += (5 in gradeObj) ? ',' + this.getGradeValue(5, gradeObj[5]) : ''
      // alpine grade
      gradeString += (2 in gradeObj) ? ',' + this.getGradeValue(2, gradeObj[2]) : ''
      // incline grade
      gradeString += (6 in gradeObj) ? ',' + this.getGradeValue(6, gradeObj[6]) + '°' : ''
      // average incline grade
      gradeString += (7 in gradeObj) ? '/' + this.getGradeValue(7, gradeObj[7]) + '°' : ''

      // from to incline grade
      if (8 in gradeObj && 9 in gradeObj) {
        gradeString += ',' + this.getGradeValue(8, gradeObj[8]) + '°-' + this.getGradeValue(9, gradeObj[9]) + '°'
      }

      if (gradeString[0] === ',') {
        gradeString = gradeString.slice(1)
      }

      if (gradeString[0] === '(' && gradeString[gradeString.length - 1] === ')') {
        gradeString = gradeString.slice(1, gradeString.length - 1)
      }

      return gradeString
    }
}

const gradeService = new GradeService()

export default gradeService
